#!/usr/bin/env node

/**
 * Скрипт для создания задач в GitHub проекте на основе ROADMAP.md
 * 
 * Использование:
 *   GITHUB_TOKEN=your_token node scripts/create-github-tasks.mjs
 * 
 * Требуется:
 *   - GITHUB_TOKEN - Personal Access Token с правами repo и project
 *   - PROJECT_NUMBER - номер проекта (можно найти в URL проекта)
 *   - OWNER - владелец репозитория (например, vanyukov)
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROJECT_NUMBER = process.env.PROJECT_NUMBER || '2';
const OWNER = process.env.OWNER || 'vanyukov';
const REPO = process.env.REPO || 'kv.FinPal';

if (!GITHUB_TOKEN) {
  console.error('❌ Ошибка: GITHUB_TOKEN не установлен');
  console.error('Создайте Personal Access Token на https://github.com/settings/tokens');
  console.error('Требуемые права: repo, project');
  process.exit(1);
}

const API_BASE = 'https://api.github.com';

/**
 * Парсит ROADMAP.md и извлекает структуру задач
 */
function parseRoadmap() {
  const roadmapPath = join(__dirname, '../docs/ROADMAP.md');
  const content = readFileSync(roadmapPath, 'utf-8');
  
  const milestones = [];
  let currentMilestone = null;
  let currentTask = null;
  let inCriteriaSection = false;
  
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Пропускаем пустые строки и разделители
    if (!trimmed || trimmed === '---') {
      continue;
    }
    
    // Определяем милстоун
    const milestoneMatch = line.match(/^### (Milestone \d+ \(M\d+\)): (.+?)(?:\s*\(.+\))?$/);
    if (milestoneMatch) {
      if (currentMilestone && currentTask) {
        currentMilestone.tasks.push(currentTask);
        currentTask = null;
      }
      if (currentMilestone) {
        milestones.push(currentMilestone);
      }
      currentMilestone = {
        title: milestoneMatch[1],
        goal: '',
        tasks: [],
        criteria: []
      };
      inCriteriaSection = false;
      continue;
    }
    
    // Определяем цель милстоуна
    if (trimmed.startsWith('**Цель:**') && currentMilestone) {
      currentMilestone.goal = trimmed.replace('**Цель:**', '').trim();
      continue;
    }
    
    // Начало секции задач
    if (trimmed === '**Задачи:**' && currentMilestone) {
      continue;
    }
    
    // Критерии завершения
    if (trimmed.startsWith('**Критерии завершения:**')) {
      inCriteriaSection = true;
      continue;
    }
    
    // Определяем задачу
    const taskMatch = line.match(/^(\d+)\. \*\*(.+?)\*\*/);
    if (taskMatch && currentMilestone) {
      if (currentTask) {
        currentMilestone.tasks.push(currentTask);
      }
      currentTask = {
        number: parseInt(taskMatch[1]),
        title: taskMatch[2],
        description: [],
        subtasks: []
      };
      inCriteriaSection = false;
      continue;
    }
    
    // Критерии завершения (чекбоксы)
    if (inCriteriaSection && trimmed.match(/^- \[ \] .+/)) {
      const criterion = trimmed.replace(/^- \[ \] /, '').trim();
      currentMilestone.criteria.push(criterion);
      continue;
    }
    
    // Подзадачи (маркированный список с отступом)
    if (line.match(/^\s{3,}- .+/) && currentTask) {
      const subtask = line.replace(/^\s+- /, '').trim();
      // Обрабатываем вложенные подзадачи
      if (line.match(/^\s{5,}- .+/)) {
        // Вложенная подзадача - добавляем с отступом
        const lastSubtask = currentTask.subtasks[currentTask.subtasks.length - 1];
        if (lastSubtask) {
          currentTask.subtasks[currentTask.subtasks.length - 1] = lastSubtask + '\n  - ' + subtask;
        } else {
          currentTask.subtasks.push(subtask);
        }
      } else {
        currentTask.subtasks.push(subtask);
      }
      continue;
    }
    
    // Пропускаем код блоки
    if (trimmed.startsWith('```')) {
      continue;
    }
    
    // Пропускаем таблицы и другие служебные элементы
    if (trimmed.startsWith('|') || trimmed.startsWith('**Код') || trimmed.startsWith('**Firestore')) {
      continue;
    }
    
    // Описание задачи (обычный текст, но не подзадачи)
    if (trimmed && currentTask && !inCriteriaSection && 
        !trimmed.startsWith('#') && !trimmed.startsWith('**') &&
        !line.match(/^\d+\./)) {
      // Не добавляем, если это начало новой секции
      if (trimmed.includes('**Цель:**') || trimmed.includes('**Задачи:**')) {
        continue;
      }
      // Добавляем только если это не подзадача
      if (!line.match(/^\s+- /)) {
        currentTask.description.push(trimmed);
      }
    }
  }
  
  // Добавляем последние элементы
  if (currentTask && currentMilestone) {
    currentMilestone.tasks.push(currentTask);
  }
  if (currentMilestone) {
    milestones.push(currentMilestone);
  }
  
  return milestones;
}

/**
 * Создает issue в GitHub
 */
async function createIssue(title, body, labels = []) {
  const response = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      body,
      labels
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create issue: ${response.status} ${error}`);
  }
  
  return response.json();
}

/**
 * Получает ID проекта по номеру через GraphQL API (для Projects v2)
 */
async function getProjectId() {
  // Для Projects v2 нужно использовать GraphQL API
  const query = `
    query($owner: String!, $projectNumber: Int!) {
      user(login: $owner) {
        projectV2(number: $projectNumber) {
          id
          title
        }
      }
    }
  `;
  
  const variables = {
    owner: OWNER,
    projectNumber: parseInt(PROJECT_NUMBER)
  };
  
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json'
    },
    body: JSON.stringify({ query, variables })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get project via GraphQL: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  if (!result.data?.user?.projectV2) {
    throw new Error(`Project #${PROJECT_NUMBER} not found for user ${OWNER}. Проверьте номер проекта и права доступа.`);
  }
  
  console.log(`✅ Найден проект: ${result.data.user.projectV2.title}`);
  return result.data.user.projectV2.id;
}

/**
 * Получает node_id issue через GraphQL API
 */
async function getIssueNodeId(issueId) {
  const query = `
    query($owner: String!, $repo: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNumber) {
          id
        }
      }
    }
  `;
  
  const issueNumber = parseInt(issueId);
  if (isNaN(issueNumber)) {
    return null;
  }
  
  const variables = {
    owner: OWNER,
    repo: REPO,
    issueNumber: issueNumber
  };
  
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    return result.data?.repository?.issue?.id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Добавляет issue в проект через GraphQL API (Projects v2)
 */
async function addIssueToProject(projectId, issueNodeId) {
  // Для Projects v2 используем GraphQL API
  const query = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId
        contentId: $contentId
      }) {
        item {
          id
        }
      }
    }
  `;
  
  const variables = {
    projectId: projectId,
    contentId: issueId
  };
  
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add item: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }
    
    return result.data?.addProjectV2ItemById?.item;
  } catch (error) {
    console.warn(`  ⚠️  Не удалось добавить в проект: ${error.message}`);
    console.warn(`  💡 Вы можете вручную добавить issue в проект через веб-интерфейс GitHub`);
    return null;
  }
}

/**
 * Форматирует тело issue
 */
function formatIssueBody(task, milestone, subtasks) {
  let body = `## ${milestone.title}\n\n`;
  body += `**Цель милстоуна:** ${milestone.goal}\n\n`;
  
  if (task.description.length > 0) {
    body += `### Описание\n\n${task.description.join('\n\n')}\n\n`;
  }
  
  if (subtasks.length > 0) {
    body += `### Подзадачи\n\n`;
    subtasks.forEach(subtask => {
      // Обрабатываем вложенные подзадачи
      if (subtask.includes('\n  - ')) {
        const [main, ...nested] = subtask.split('\n  - ');
        body += `- [ ] ${main}\n`;
        nested.forEach(nest => {
          body += `  - [ ] ${nest}\n`;
        });
      } else {
        body += `- [ ] ${subtask}\n`;
      }
    });
    body += '\n';
  }
  
  if (milestone.criteria.length > 0) {
    body += `### Критерии завершения милстоуна\n\n`;
    milestone.criteria.forEach(criterion => {
      body += `- [ ] ${criterion}\n`;
    });
    body += '\n';
  }
  
  body += `---\n\n`;
  body += `*Создано автоматически из [ROADMAP.md](../../docs/ROADMAP.md)*`;
  
  return body;
}

/**
 * Основная функция
 */
async function main() {
  console.log('📋 Парсинг ROADMAP.md...');
  const milestones = parseRoadmap();
  console.log(`✅ Найдено милстоунов: ${milestones.length}\n`);
  
  let projectId = null;
  try {
    console.log('🔍 Получение ID проекта...');
    projectId = await getProjectId();
    console.log(`✅ ID проекта: ${projectId}\n`);
  } catch (error) {
    console.warn(`⚠️  Не удалось получить проект: ${error.message}`);
    console.warn(`📝 Issues будут созданы, но не добавлены в проект автоматически`);
    console.warn(`💡 Вы можете добавить их вручную через веб-интерфейс GitHub\n`);
  }
  
  const createdIssues = [];
  
  for (const milestone of milestones) {
    console.log(`\n📦 Обработка ${milestone.title}...`);
    
    for (const task of milestone.tasks) {
      const title = `[${milestone.title}] ${task.title}`;
      const body = formatIssueBody(task, milestone, task.subtasks);
      const labels = [milestone.title.replace(/\(M\d+\)/, '').trim()];
      
      try {
        console.log(`  ➕ Создание задачи: ${task.title}...`);
        const issue = await createIssue(title, body, labels);
        console.log(`  ✅ Создана: #${issue.number} - ${issue.title}`);
        
        // Добавляем в проект, если проект доступен
        if (projectId) {
          console.log(`  🔗 Добавление в проект...`);
          // Для GraphQL API нужен node_id, получаем его по номеру issue
          const issueNodeId = await getIssueNodeId(issue.number);
          if (issueNodeId) {
            const result = await addIssueToProject(projectId, issueNodeId);
            if (result) {
              console.log(`  ✅ Добавлена в проект`);
            }
          }
        }
        
        createdIssues.push(issue);
        
        // Небольшая задержка, чтобы не превысить rate limit
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Ошибка при создании задачи "${task.title}":`, error.message);
      }
    }
  }
  
  console.log(`\n\n✨ Готово! Создано задач: ${createdIssues.length}`);
  console.log(`\n📝 Созданные issues:`);
  createdIssues.forEach(issue => {
    console.log(`   - #${issue.number}: ${issue.title}`);
    console.log(`     ${issue.html_url}`);
  });
  
  if (!projectId) {
    console.log(`\n💡 Для добавления issues в проект:`);
    console.log(`\n   Вариант 1: Веб-интерфейс (рекомендуется)`);
    console.log(`   1. Откройте проект: https://github.com/users/${OWNER}/projects/${PROJECT_NUMBER}`);
    console.log(`   2. Нажмите "+" в нужной колонке (например, "To do")`);
    console.log(`   3. Выберите "Add item" и найдите созданные issues`);
    console.log(`\n   Вариант 2: GitHub CLI`);
    console.log(`   1. Обновите права токена: gh auth refresh -s read:project`);
    console.log(`   2. Добавьте issues по одному:`);
    createdIssues.forEach(issue => {
      console.log(`      gh project item-add ${PROJECT_NUMBER} --owner ${OWNER} --url ${issue.html_url}`);
    });
  } else {
    // Проверяем, были ли проблемы с добавлением
    const failedToAdd = createdIssues.filter(issue => {
      // Если есть issues, но проект был найден, возможно не все добавились
      return true; // Показываем инструкции в любом случае
    });
    
    if (failedToAdd.length > 0) {
      console.log(`\n💡 Если некоторые issues не добавились в проект:`);
      console.log(`   1. Откройте проект: https://github.com/users/${OWNER}/projects/${PROJECT_NUMBER}`);
      console.log(`   2. Добавьте их вручную через веб-интерфейс`);
      console.log(`   3. Или используйте GitHub CLI (после обновления прав):`);
      console.log(`      gh auth refresh -s read:project`);
      createdIssues.forEach(issue => {
        console.log(`      gh project item-add ${PROJECT_NUMBER} --owner ${OWNER} --url ${issue.html_url}`);
      });
    }
  }
}

main().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});

