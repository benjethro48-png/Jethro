let issues = JSON.parse(localStorage.getItem('campus_issues')) || [];

const form = document.getElementById('issue-form');
const issuesTableBody = document.getElementById('issues-table-body');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');

// Form Submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newIssue = {
    id: 'ISS-' + Date.now().toString().slice(-4),
    category: document.getElementById('category').value,
    location: document.location = document.getElementById('location').value,
    priority: document.getElementById('priority').value,
    description: document.getElementById('description').value,
    status: 'Pending',
    createdAt: new Date().toLocaleDateString()
  };

  issues.push(newIssue);
  saveAndRender();
  form.reset();
});

// Update Status
function updateStatus(id, newStatus) {
  issues = issues.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue);
  saveAndRender();
}

// Delete Issue
function deleteIssue(id) {
  issues = issues.filter(issue => issue.id !== id);
  saveAndRender();
}

// Update Statistics Dashboard
function updateStats() {
  document.getElementById('total-count').textContent = issues.length;
  document.getElementById('pending-count').textContent = issues.filter(i => i.status === 'Pending').length;
  document.getElementById('progress-count').textContent = issues.filter(i => i.status === 'In Progress').length;
  document.getElementById('resolved-count').textContent = issues.filter(i => i.status === 'Resolved').length;
}

// Render Dashboard Table
function renderTable() {
  const query = searchInput.value.toLowerCase();
  const statusFilter = filterStatus.value;

  issuesTableBody.innerHTML = '';

  const filteredIssues = issues.filter(issue => {
    const matchesQuery = issue.description.toLowerCase().includes(query) || 
                         issue.location.toLowerCase().includes(query) ||
                         issue.category.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  filteredIssues.forEach(issue => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><strong>${issue.id}</strong></td>
      <td>${issue.category}</td>
      <td>${issue.location}</td>
      <td><span class="badge-${issue.priority.toLowerCase()}">${issue.priority}</span></td>
      <td>${issue.description}</td>
      <td>
        <select class="status-select" onchange="updateStatus('${issue.id}', this.value)">
          <option value="Pending" ${issue.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Resolved" ${issue.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </td>
      <td>
        <button class="btn-delete" onclick="deleteIssue('${issue.id}')">Delete</button>
      </td>
    `;
    issuesTableBody.appendChild(row);
  });

  updateStats();
}

function saveAndRender() {
  localStorage.setItem('campus_issues', JSON.stringify(issues));
  renderTable();
}

// Event Listeners for Filters
searchInput.addEventListener('input', renderTable);
filterStatus.addEventListener('change', renderTable);

// Initial Render
renderTable();
