// 제품 데이터
const product_data = [
  { category: "상의", brand: 'Supreme', product: '슈프림 박스로고 후드티', price: '390,000' },
  { category: "하의", brand: 'DIESEL', product: '디젤 트랙 팬츠', price: '188,000' },
  { category: "신발", brand: 'Nike', product: '에어포스 1', price: '137,000' },
  { category: "패션잡화", brand: 'Music&Goods', product: '빵빵이 키링', price: '29,000' },
  { category: "상의", brand: 'Adidas', product: '아디다스 오리지널 티셔츠', price: '59,000' },
  { category: "하의", brand: 'Levis', product: '리바이스 501 청바지', price: '129,000' },
  { category: "신발", brand: 'Adidas', product: '아디다스 슈퍼스타', price: '119,000' },
  { category: "패션잡화", brand: 'Gucci', product: '구찌 벨트', price: '450,000' },
  { category: "상의", brand: 'Nike', product: '나이키 드라이핏 후디', price: '89,000' },
  { category: "하의", brand: 'Uniqlo', product: '유니클로 와이드 팬츠', price: '49,900' },
  { category: "신발", brand: 'Converse', product: '컨버스 척테일러', price: '69,000' },
  { category: "패션잡화", brand: 'Hermes', product: '에르메스 스카프', price: '590,000' },
  { category: "상의", brand: 'Musinsa', product: '무신사 스탠다드 맨투맨', price: '35,900' },
  { category: "하의", brand: 'ZARA', product: '자라 슬림핏 팬츠', price: '59,900' },
  { category: "신발", brand: 'Vans', product: '반스 올드스쿨', price: '79,000' },
  { category: "패션잡화", brand: 'Louis Vuitton', product: 'LV 지갑', price: '780,000' },
];

// 페이지 관련 변수
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...product_data];

// DOM 요소들
const productsSection = document.getElementById('products-section');
const registrationSection = document.getElementById('registration-section');
const successSection = document.getElementById('success-section');
const productsNav = document.getElementById('products-nav');
const registerNav = document.getElementById('register-nav');
const tableBody = document.getElementById('product_data_Table');
const pagination = document.getElementById('pagination');
const categorySelect = document.getElementById('inlineFormSelectPref');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const backToProducts = document.getElementById('backToProducts');
const returnToProducts = document.getElementById('returnToProducts');
const darkModeToggle = document.getElementById('darkModeToggle');
const form = document.getElementById('registrationForm');
const password = document.getElementById('userPassword');
const passwordConfirm = document.getElementById('userPasswordConfirm');
const userId = document.getElementById('userId');

// 페이지 로드 시 현재 날짜 및 시간 표시
function updateDateTime() {
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  document.getElementById('current-datetime').textContent = now.toLocaleString('ko-KR', options);
}

// 다크 모드 토글 기능
function setupDarkModeToggle() {
  darkModeToggle.addEventListener('change', () => {
    document.documentElement.setAttribute('data-bs-theme', darkModeToggle.checked ? 'dark' : 'light');
  });
}

// 제품 데이터 필터링 및 표시
function displayProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  tableBody.innerHTML = '';
  
  if (paginatedData.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 4;
    cell.textContent = '검색 결과가 없습니다.';
    cell.className = 'text-center';
    return;
  }
  
  paginatedData.forEach((item) => {
    const row = tableBody.insertRow();
    row.insertCell(0).innerHTML = item.category;
    row.insertCell(1).innerHTML = item.brand;
    row.insertCell(2).innerHTML = item.product;
    row.insertCell(3).innerHTML = item.price;
  });
  
  updatePagination();
}

// 페이지네이션 업데이트
function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  pagination.innerHTML = '';
  
  // 이전 버튼
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  const prevLink = document.createElement('a');
  prevLink.className = 'page-link';
  prevLink.href = '#';
  prevLink.textContent = '이전';
  prevLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayProducts();
    }
  });
  prevLi.appendChild(prevLink);
  pagination.appendChild(prevLi);
  
  // 페이지 버튼
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement('li');
    pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      displayProducts();
    });
    pageLi.appendChild(pageLink);
    pagination.appendChild(pageLi);
  }
  
  // 다음 버튼
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  const nextLink = document.createElement('a');
  nextLink.className = 'page-link';
  nextLink.href = '#';
  nextLink.textContent = '다음';
  nextLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      displayProducts();
    }
  });
  nextLi.appendChild(nextLink);
  pagination.appendChild(nextLi);
}

// 카테고리 및 검색어로 필터링
function filterProducts() {
  const category = categorySelect.value;
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  filteredData = product_data.filter(item => {
    const categoryMatch = category === 'all' || item.category === category;
    const searchMatch = searchTerm === '' || 
                      item.product.toLowerCase().includes(searchTerm) || 
                      item.brand.toLowerCase().includes(searchTerm);
    return categoryMatch && searchMatch;
  });
  
  currentPage = 1;
  displayProducts();
}

// 탭 전환 관련 함수
function showSection(sectionId) {
  const sections = ['products-section', 'registration-section', 'success-section'];
  
  sections.forEach(id => {
    document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
  });
  
  // 네비게이션 활성화 상태 업데이트
  if (sectionId === 'products-section') {
    productsNav.classList.add('active');
    registerNav.classList.remove('active');
  } else if (sectionId === 'registration-section') {
    productsNav.classList.remove('active');
    registerNav.classList.add('active');
  }
}

// 폼 유효성 검사 설정
function setupFormValidation() {
  // 비밀번호 확인 일치 검사
  passwordConfirm.addEventListener('input', function() {
    if (password.value !== passwordConfirm.value) {
      passwordConfirm.setCustomValidity('비밀번호가 일치하지 않습니다.');
    } else {
      passwordConfirm.setCustomValidity('');
    }
  });
  
  // 아이디 유효성 검사
  userId.addEventListener('input', function() {
    const value = userId.value;
    const alphanumeric = /^[a-zA-Z0-9]+$/.test(value);
    
    if (!alphanumeric && value.length > 0) {
      userId.setCustomValidity('아이디는 영문과 숫자만 사용 가능합니다.');
    } else {
      userId.setCustomValidity('');
    }
  });
  
  // 비밀번호 복잡성 검사
  password.addEventListener('input', function() {
    const value = password.value;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (value.length >= 8 && hasLetter && hasNumber && hasSpecial) {
      password.setCustomValidity('');
    } else {
      password.setCustomValidity('비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.');
    }
  });
}

// 폼 제출 처리
function setupFormSubmit() {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add('was-validated');
      return;
    }
    
    // 회원가입 정보 수집
    const userInfo = {
      id: document.getElementById('userId').value,
      name: document.getElementById('userName').value,
      email: document.getElementById('userEmail').value,
      job: document.getElementById('userJob').options[document.getElementById('userJob').selectedIndex].text,
      intro: document.getElementById('userIntro').value
    };
    
    // 회원가입 상세 정보 표시
    const detailsContainer = document.getElementById('registration-details');
    detailsContainer.innerHTML = `
      <div class="card">
        <div class="card-body">
          <p><strong>아이디:</strong> ${userInfo.id}</p>
          <p><strong>이름:</strong> ${userInfo.name}</p>
          <p><strong>이메일:</strong> ${userInfo.email}</p>
          <p><strong>희망직무:</strong> ${userInfo.job}</p>
          <p><strong>자기소개:</strong></p>
          <p class="border p-2 rounded">${userInfo.intro}</p>
        </div>
      </div>
    `;
    
    // 알림창 표시
    const alertHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>회원가입 성공!</strong> ${userInfo.name}님, 가입을 축하합니다.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    
    detailsContainer.insertAdjacentHTML('beforebegin', alertHTML);
    
    // 성공 페이지로 이동
    showSection('success-section');
    
    // 폼 초기화
    form.reset();
    form.classList.remove('was-validated');
  });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 검색 버튼 이벤트
  searchBtn.addEventListener('click', filterProducts);
  
  // 검색 입력창 엔터키 이벤트
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterProducts();
    }
  });
  
  // 카테고리 선택 이벤트
  categorySelect.addEventListener('change', filterProducts);
  
  // 네비게이션 이벤트
  productsNav.addEventListener('click', function(e) {
    e.preventDefault();
    showSection('products-section');
  });
  
  registerNav.addEventListener('click', function(e) {
    e.preventDefault();
    showSection('registration-section');
  });
  
  backToProducts.addEventListener('click', function() {
    showSection('products-section');
  });
  
  returnToProducts.addEventListener('click', function() {
    showSection('products-section');
  });
}

// 초기화 함수
function init() {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setupDarkModeToggle();
  displayProducts();
  setupFormValidation();
  setupFormSubmit();
  setupEventListeners();
  showSection('products-section');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);