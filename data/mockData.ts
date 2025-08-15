import { Board } from '@/types/kanban';

export const initialBoard: Board = {
  columns: [
    {
      id: 'todo',
      title: 'TO DO',
      count: 1,
      tasks: [
        {
          id: '1',
          issueKey: 'CPG-3',
          title: '(Sample) Implement Transaction History Feature',
          labels: [
            { text: '(SAMPLE) PAYMENT PROCESSING', color: 'purple' }
          ],
          type: 'task',
          isChecked: true
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'IN PROGRESS',
      count: 15,
      tasks: [
        {
          id: '2',
          issueKey: 'CPG-6',
          title: '(Sample) Implement Two-Factor Authentication',
          labels: [
            { text: '(SAMPLE) USER AUTHENTICATION', color: 'purple' }
          ],
          type: 'task',
          isChecked: true
        },
        {
          id: '3',
          issueKey: 'CPG-8',
          title: 'greergegr',
          assignee: {
            name: 'greergegr',
            initials: 'G'
          },
          priority: 'high',
          isChecked: true
        },
        {
          id: '4',
          issueKey: 'CPG-9',
          title: 'gerrgeegr',
          priority: 'high',
          isChecked: true
        },
        {
          id: '5',
          issueKey: 'CPG-10',
          title: 'ergergegr',
          priority: 'high',
          isChecked: true
        },
        {
          id: '6',
          issueKey: 'CPG-11',
          title: 'egrergegr',
          priority: 'high',
          isChecked: true
        }
      ]
    },
    {
      id: 'in-review',
      title: 'IN REVIEW',
      count: 10,
      tasks: [
        {
          id: '7',
          issueKey: 'CPG-4',
          title: '(Sample) Integrate Cryptocurrency Payment APIs',
          labels: [
            { text: '(SAMPLE) PAYMENT PROCESSING', color: 'purple' }
          ],
          isChecked: true
        },
        {
          id: '8',
          issueKey: 'CPG-5',
          title: '(Sample) Implement OAuth 2.0 Authentication',
          labels: [
            { text: '(SAMPLE) USER AUTHENTICATION', color: 'purple' }
          ],
          isChecked: true
        },
        {
          id: '9',
          issueKey: 'CPG-16',
          title: 'j jhjj',
          priority: 'medium',
          assignee: {
            name: 'AH',
            initials: 'AH',
            avatar: 'AH'
          },
          isChecked: true
        },
        {
          id: '10',
          issueKey: 'CPG-17',
          title: 'uky',
          priority: 'medium',
          isChecked: true
        }
      ]
    },
    {
      id: 'erg',
      title: 'ERG',
      count: 18,
      tasks: [
        {
          id: '11',
          issueKey: 'CPG-20',
          title: 'uky',
          priority: 'high',
          isChecked: true
        },
        {
          id: '12',
          issueKey: 'CPG-21',
          title: 'kuy',
          priority: 'high',
          isChecked: true
        },
        {
          id: '13',
          issueKey: 'CPG-22',
          title: 'yuk',
          priority: 'medium',
          isChecked: true
        },
        {
          id: '14',
          issueKey: 'CPG-23',
          title: 'uyk',
          priority: 'medium',
          isChecked: true
        },
        {
          id: '15',
          issueKey: 'CPG-24',
          title: 'uky',
          priority: 'medium',
          isChecked: true
        }
      ]
    },
    {
      id: 'done',
      title: 'DONE',
      count: 13,
      tasks: [
        {
          id: '16',
          issueKey: 'CPG-7',
          title: 'fgr',
          isChecked: true,
          priority: 'high'
        },
        {
          id: '17',
          issueKey: 'CPG-31',
          title: 'uyk',
          isChecked: true,
          priority: 'high'
        },
        {
          id: '18',
          issueKey: 'CPG-32',
          title: 'kuy',
          isChecked: true,
          priority: 'medium'
        },
        {
          id: '19',
          issueKey: 'CPG-33',
          title: 'kuy',
          isChecked: true,
          priority: 'medium'
        },
        {
          id: '20',
          issueKey: 'CPG-34',
          title: 'kuy',
          isChecked: true,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'rvie',
      title: 'RVIE',
      count: 0,
      tasks: [
        {
          id: '21',
          issueKey: 'CPG-35',
          title: 'uyk',
          isChecked: true
        },
        {
          id: '22',
          issueKey: 'CPG-36',
          title: 'yuk',
          isChecked: true
        },
        {
          id: '23',
          issueKey: 'CPG-37',
          title: 'uyk',
          isChecked: true
        },
        {
          id: '24',
          issueKey: 'CPG-38',
          title: 'uyk',
          isChecked: true
        },
        {
          id: '25',
          issueKey: 'CPG-39',
          title: 'uyk',
          isChecked: true
        }
      ]
    }
  ]
};
