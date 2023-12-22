// 날짜 정보 받아오고 정리
function updateClock() {
    const current = new Date();
    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth()+1;
    const currentDate = current.getDate();
    const currentHour = current.getHours();
    const currentMinute = current.getMinutes();
    const dayTranslation = (num) => {
        const week = ["일", "월", "화", "수", "목", "금", "토"];
        return week[num];
    };
    const currentDay = dayTranslation(current.getDay());

    // 계절 정보에 맞춰 배경 세팅하기
    const container = document.getElementById('container');
    const spring = 'url("./asset/spring.jpg")';
    const summer = 'url("./asset/summer.jpg")';
    const fall = 'url("./asset/fall.jpg")';
    const winter = 'url("./asset/winter.jpg")';

    if (currentMonth > 2 && currentMonth < 6) {
        container.style.backgroundImage = `${spring}`
    } else if (currentMonth > 5 && currentMonth < 9) {
        container.style.backgroundImage = `${summer}`
    } else if (currentMonth > 8 && currentMonth < 12) {
        container.style.backgroundImage = `${fall}`
    } else {
        container.style.backgroundImage = `${winter}`
    }

    // 날짜 정보 삽입하기
    const clockTime = document.getElementById('clock_main');
    const clockDate = document.getElementById('clock_sub');
    let currentAMPM = "";
    let convertHour = 0;
    if (currentHour > 13) {
        convertHour = currentHour-12;
        currentAMPM = "PM";
    } else {
        convertHour = currentHour;
        currentAMPM = "AM";
    }

    const timeInfo = `${convertHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    const dateInfo = `${currentYear}년 ${currentMonth}월 ${currentDate}일 (${currentDay})`;

    clockTime.innerHTML = `<span>${currentAMPM}</span><span>${timeInfo}</span>`;
    clockDate.innerHTML = `<span>${dateInfo}</span>`
};

updateClock();

setInterval(updateClock, 1000);

// 리스트 드롭다운
const listDropdown = document.getElementById('list_dropdown');
const listContent = document.getElementById('dropdown_content');
const listCotroller = document.getElementById('list_controler');

listDropdown.addEventListener('click', () => {
    listContent.classList.toggle('act');
    listCotroller.classList.toggle('act');
});

// 리스트 추가
const addBtn = document.getElementById('add_btn');
const listValue = document.getElementById('todo_list');
let removeBtn = document.querySelectorAll('.list_remove_btn');
let listCheckBox = document.querySelectorAll('.list_check');
const checkedNum = document.getElementById('checked_num');
const listNum = document.getElementById('list_num');

// 입력값이 있을 때만 활성화
function updateButtonStatus() {
    if (listValue.value.length === 0) {
        addBtn.disabled = true;
        addBtn.style.pointerEvents = 'none'; 
        addBtn.style.opacity = 0.5; 
    } else {
        addBtn.disabled = false;
        addBtn.style.pointerEvents = 'auto'; 
        addBtn.style.opacity = 1; 
    }
};
listValue.addEventListener('input', updateButtonStatus);

updateButtonStatus();

// 클릭 이벤트를 추가할 함수
function addRemoveEvent(item) {
    item.addEventListener('click', () => {
        var parent = item.parentElement;
        parent.remove();
        updateCount();
        saveToLocalStorage();
    });
}

// 기존의 removeBtn에 이벤트 추가
removeBtn.forEach(item => {
    addRemoveEvent(item);
});

// 초기 카운트 설정
updateCount();

// 페이지 로드 시 로컬 스토리지에서 데이터 불러오기
loadFromLocalStorage();

function addTodo() {
    if (listValue.value.length > 0) {
        // 새로운 li 요소 생성
        const newListItem = document.createElement('li');
        newListItem.innerHTML = `
            <label>
                <input type="checkbox" class='list_check'/>
                <span>${listValue.value}</span>
            </label>
            <button class='list_remove_btn'>
                &times;
            </button>
        `;
        
        // 생성한 li 요소를 listContent에 추가
        listContent.appendChild(newListItem);

        // 새로 추가된 버튼에 클릭 이벤트 추가
        const newRemoveBtn = newListItem.querySelector('.list_remove_btn');
        addRemoveEvent(newRemoveBtn);
        // 새로 추가된 체크박스 업데이트
        listCheckBox = document.querySelectorAll('.list_check');
        updateCount();
        saveToLocalStorage();

        // input 값 초기화
        listValue.value = '';
        // 리스트 내리기
        if (listContent.classList.contains('act') && !listCotroller.classList.contains('act')) {
            listContent.classList.remove('act');
            listCotroller.classList.add('act');
        }
    };
};

function handleEnter(event) {
    if (event.key === "Enter") {
        addTodo();
    }
};

addBtn.addEventListener('click', () => {
    addTodo();
});

// 체크박스 상태에 따라 카운트 업데이트
function updateCount() {
    let checkCount = 0;
    listCheckBox.forEach(item => {
        if (item.checked) {
            checkCount += 1;
        }
    });
    checkedNum.innerText = `${checkCount} /`;
    listNum.innerText = `${listCheckBox.length}`;
}

// 로컬 스토리지에 데이터 저장
function saveToLocalStorage() {
    const data = [];
    listCheckBox.forEach(item => {
        data.push({
            text: item.nextElementSibling.innerText,
            checked: item.checked
        });
    });
    localStorage.setItem('listData', JSON.stringify(data));
}

// 로컬 스토리지에서 데이터 불러오기
function loadFromLocalStorage() {
    const dataString = localStorage.getItem('listData');
    if (dataString) {
        const data = JSON.parse(dataString);
        data.forEach(item => {
            const newListItem = document.createElement('li');
            newListItem.innerHTML = `
                <label>
                    <input type="checkbox" class='list_check' ${item.checked ? 'checked' : ''}/>
                    <span>${item.text}</span>
                </label>
                <button class='list_remove_btn'>
                    &times;
                </button>
            `;
            listContent.appendChild(newListItem);

            const newRemoveBtn = newListItem.querySelector('.list_remove_btn');
            addRemoveEvent(newRemoveBtn);
        });

        listCheckBox = document.querySelectorAll('.list_check');
        updateCount();
    }
}