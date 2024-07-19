const url = 'https://mocki.io/v1/f0b8306c-781b-45f1-9f88-0dc0a039f46f'

class Person {
    constructor(name, address, email, phoneNumber, birthdate) {
        this.name = name;
        this.address = address;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.birthdate = new Date(birthdate);
    }

    calculateAge() {
        const diff = Date.now() - this.birthdate.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}

class User extends Person {
    constructor(name, address, email, phoneNumber, birthdate, job, company) {
        super(name, address, email, phoneNumber, birthdate);
        this.job = job;
        this.company = company;
    }

    isRetired() {
        return this.calculateAge() > 65;
    }
}

// Fetching and displaying data
const users = [];
const rowsPerPage = 10;
let currentPage = 1;
let filteredUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                users.push(new User(user.name, user.address, user.email, user.phone_number, user.birthdate, user.job, user.company));
            });
            filteredUsers = users;
            displayUsers();
        })
        .catch(error => console.error('Error fetching user data:', error));

    document.getElementById('search-input').addEventListener('input', searchUsers);
    document.getElementById('previous-button').addEventListener('click', () => changePage(-1));
    document.getElementById('next-button').addEventListener('click', () => changePage(1));
});

function displayUsers() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    const tableBody = document.getElementById('user-table-body');
    tableBody.innerHTML = '';

    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.job}</td>
            <td>${user.company}</td>
            <td>${user.calculateAge()}</td>
            <td>${user.isRetired() ? 'Yes' : 'No'}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('pagination-info').textContent = `Page ${currentPage} of ${Math.ceil(filteredUsers.length / rowsPerPage)}`;
}

function searchUsers(event) {
    const query = event.target.value.toLowerCase();
    filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
    );
    currentPage = 1;
    displayUsers();
}

function changePage(direction) {
    if ((direction === -1 && currentPage > 1) || (direction === 1 && currentPage < Math.ceil(filteredUsers.length / rowsPerPage))) {
        currentPage += direction;
        displayUsers();
    }
}
