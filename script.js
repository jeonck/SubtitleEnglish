// Dark mode initialization
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Global state
let tableData = [];
let columnVisibility = {
    time: true,
    subtitle: false, // 영어 자막 기본값을 false로 설정
    translation: true
};
let rowVisibility = [];

function parseData() {
    const input = document.getElementById('dataInput').value;
    if (!input.trim()) {
        alert('데이터를 입력해주세요.');
        return;
    }

    tableData = input.split('\n')
        .filter(line => line.trim())
        .map(line => {
            const [time, subtitle, translation] = line.split('\t\t').map(item => item.trim());
            return { time, subtitle, translation };
        });

    renderTable();
    showControls();
    updateStats();
    
    // 초기 상태에서 영어 자막 버튼의 텍스트를 '영어 보기'로 변경
    const subtitleButton = document.getElementById('toggleSubtitle');
    subtitleButton.textContent = '영어 보기';
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    tableData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
        tr.onclick = () => toggleRow(index);
        
        const timeCell = document.createElement('td');
        timeCell.className = `px-4 py-3 ${!columnVisibility.time ? 'hidden-content' : ''}`;
        timeCell.textContent = row.time;
        
        const subtitleCell = document.createElement('td');
        subtitleCell.className = `px-4 py-3 ${!columnVisibility.subtitle ? 'hidden-content' : ''}`;
        subtitleCell.textContent = row.subtitle;
        
        const translationCell = document.createElement('td');
        translationCell.className = `px-4 py-3 ${!columnVisibility.translation ? 'hidden-content' : ''}`;
        translationCell.textContent = row.translation;
        
        tr.appendChild(timeCell);
        tr.appendChild(subtitleCell);
        tr.appendChild(translationCell);
        tableBody.appendChild(tr);
    });
    
    document.getElementById('tableContainer').classList.remove('hidden');
}

function toggleColumn(column) {
    columnVisibility[column] = !columnVisibility[column];
    const button = document.getElementById(`toggle${column.charAt(0).toUpperCase() + column.slice(1)}`);
    button.textContent = `${column === 'time' ? '시간' : column === 'subtitle' ? '영어' : '번역'} ${columnVisibility[column] ? '숨기기' : '보기'}`;
    renderTable();
}

function toggleRow(index) {
    const row = document.getElementById('tableBody').children[index];
    const cells = row.getElementsByTagName('td');
    Array.from(cells).forEach(cell => {
        cell.classList.toggle('hidden-content');
    });
}

function showAll() {
    columnVisibility = {
        time: true,
        subtitle: true,
        translation: true
    };
    
    document.querySelectorAll('.column-toggle').forEach(button => {
        const type = button.id.replace('toggle', '').toLowerCase();
        button.textContent = `${type === 'time' ? '시간' : type === 'subtitle' ? '영어' : '번역'} 숨기기`;
    });
    
    const rows = document.getElementById('tableBody').children;
    Array.from(rows).forEach(row => {
        Array.from(row.getElementsByTagName('td')).forEach(cell => {
            cell.classList.remove('hidden-content');
        });
    });
    
    renderTable();
}

function toggleYouTube() {
    const container = document.getElementById('youtubeContainer');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

function showControls() {
    document.getElementById('controlPanel').classList.remove('hidden');
}

function clearData() {
    document.getElementById('dataInput').value = '';
    tableData = [];
    document.getElementById('tableContainer').classList.add('hidden');
    document.getElementById('controlPanel').classList.add('hidden');
    document.getElementById('stats').classList.add('hidden');
}

function loadSampleData() {
    const sampleData = 
`00:01:57		This next question is from Aung.		다음 질문은 Aung에게서 왔습니다.
00:02:29		stay fit, and it helps my mind to stay fit as well.		마음도 건강하게 유지하는 데 도움이 된다는 걸 알게 됐습니다.
00:02:32		This next question is from Stefania. I'd like to		다음 질문은 스테파니아로부터 왔습니다.
00:02:35		know about the school system where you live.		당신이 사는 곳의 학교 시스템에 대해 알고 싶습니다.
00:02:37		Which subjects do you teach, how many hours		어떤 과목을 가르치시나요? 주당 몇 시간씩 가르치시나요?
00:02:41		each week, and what technology do you use?		그리고 어떤 기술을 사용하시나요?
00:02:44		So I currently teach French and business.		저는 현재 프랑스어와 비즈니스를 가르치고 있습니다.
00:02:47		Those are the two classes I teach.		제가 가르치는 과목은 두 가지입니다.
00:02:49		I also sometimes teach a computer class.		저는 가끔 컴퓨터 강의도 합니다.`;

    document.getElementById('dataInput').value = sampleData;
    parseData();
}

// 페이지 로드 시 자동으로 샘플 데이터 로드
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    parseData();
});

function updateStats() {
    const stats = document.getElementById('stats');
    stats.classList.remove('hidden');
    const statsText = document.getElementById('statsText');
    statsText.textContent = `총 ${tableData.length}개의 자막이 있습니다.`;
}