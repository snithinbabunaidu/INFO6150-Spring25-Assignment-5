// Login validation
function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginAlert = document.getElementById('loginAlert');

    // Hard-coded credentials check
    if (username === "amrita" && password === "info") {
        // Successful login
        loginAlert.classList.add('d-none');
        window.location.href = 'dashboard.html';
        return false;
    } else {
        // Failed login
        loginAlert.classList.remove('d-none');
        document.getElementById('loginForm').classList.add('was-validated');
        return false;
    }
}

// Password visibility toggle
document.getElementById('togglePassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const toggle = document.getElementById('sidebarToggle');

    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        content.classList.toggle('shifted');
    });
});

// Real-time validation
const inputs = document.querySelectorAll('.form-control');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.remove('is-invalid');
        }
    });
});

// Aircraft Models Data
const aircraftModels = {
    manned: [
        "F-22 Raptor",
        "F-35 Lightning II",
        "F/A-18 Super Hornet",
        "F-16 Fighting Falcon"
    ],
    unmanned: [
        "MQ-9 Reaper",
        "RQ-4 Global Hawk",
        "MQ-1C Gray Eagle",
        "X-47B UCAS-D"
    ]
};

// Handle aircraft category selection
document.getElementById('aircraftCategory')?.addEventListener('change', function() {
    const modelSelect = document.getElementById('aircraftModel');
    modelSelect.innerHTML = '<option value="">Select Aircraft Model</option>';
    modelSelect.disabled = true;

    if (this.value) {
        const models = aircraftModels[this.value];
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
        modelSelect.disabled = false;
    }
});

// Handle mission creation
document.getElementById('createMission')?.addEventListener('click', function() {
    const form = document.getElementById('newMissionForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Gather all form data
    const missionData = {
        number: document.querySelectorAll('.mission-card').length + 1,
        category: document.getElementById('aircraftCategory').value,
        model: document.getElementById('aircraftModel').value,
        count: document.getElementById('vehicleCount').value,
        description: document.getElementById('missionDescription').value,
        type: document.getElementById('missionType').value
    };

    // Add mission-specific data
    switch(missionData.type) {
        case 'payload':
            missionData.weight = document.getElementById('payloadWeight').value;
            missionData.distance = document.getElementById('deliveryDistance').value;
            break;
        case 'emergency':
            missionData.supplyType = document.getElementById('supplyType').value;
            missionData.population = document.getElementById('population').value;
            missionData.urgencyLevel = document.getElementById('urgencyLevel').value;
            break;
        case 'target':
            missionData.targetType = document.getElementById('targetType').value;
            missionData.threatLevel = document.getElementById('threatLevel').value;
            missionData.civilianProximity = document.getElementById('civilianProximity').value;
            break;
        case 'rtl':
            missionData.currentDistance = document.getElementById('currentDistance').value;
            missionData.fuelStatus = document.getElementById('fuelStatus').value;
            missionData.priorityLevel = document.getElementById('priorityLevel').value;
            break;
        case 'forage':
            missionData.searchRadius = document.getElementById('searchRadius').value;
            missionData.resourceType = document.getElementById('resourceType').value;
            missionData.duration = document.getElementById('duration').value;
            break;
    }

    // Create and insert the mission card
    const missionCard = createMissionCard(missionData);
    document.getElementById('missionContainer').insertAdjacentHTML('afterbegin', missionCard);
    
    // Start mission simulation
    simulateMission(missionData.number);

    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('newMissionModal'));
    modal.hide();
    form.reset();
});

// Function to create mission card HTML
function createMissionCard(mission) {
    // Get mission color class
    const missionColorClass = getMissionColorClass(mission.type);
    
    // Generate mission-specific details HTML
    let missionDetailsHtml = '';
    switch(mission.type) {
        case 'payload':
            missionDetailsHtml = `
                <p class="mb-1"><i class="fas fa-weight-hanging me-2"></i>Weight: ${mission.weight} kg</p>
                <p class="mb-1"><i class="fas fa-route me-2"></i>Distance: ${mission.distance} km</p>
            `;
            break;
        case 'emergency':
            missionDetailsHtml = `
                <p class="mb-1"><i class="fas fa-first-aid me-2"></i>Supply: ${mission.supplyType}</p>
                <p class="mb-1"><i class="fas fa-users me-2"></i>Population: ${mission.population}</p>
                <p class="mb-1"><i class="fas fa-exclamation-triangle me-2"></i>Urgency: ${mission.urgencyLevel}</p>
            `;
            break;
        case 'target':
            missionDetailsHtml = `
                <p class="mb-1"><i class="fas fa-crosshairs me-2"></i>Target: ${mission.targetType}</p>
                <p class="mb-1"><i class="fas fa-shield-alt me-2"></i>Threat: ${mission.threatLevel}</p>
                <p class="mb-1"><i class="fas fa-street-view me-2"></i>Civilian Distance: ${mission.civilianProximity}m</p>
            `;
            break;
        case 'rtl':
            missionDetailsHtml = `
                <p class="mb-1"><i class="fas fa-map-marker-alt me-2"></i>Distance: ${mission.currentDistance} km</p>
                <p class="mb-1"><i class="fas fa-gas-pump me-2"></i>Fuel: ${mission.fuelStatus}%</p>
                <p class="mb-1"><i class="fas fa-flag me-2"></i>Priority: ${mission.priorityLevel}</p>
            `;
            break;
        case 'forage':
            missionDetailsHtml = `
                <p class="mb-1"><i class="fas fa-search me-2"></i>Radius: ${mission.searchRadius} km</p>
                <p class="mb-1"><i class="fas fa-box me-2"></i>Resource: ${mission.resourceType}</p>
                <p class="mb-1"><i class="fas fa-clock me-2"></i>Duration: ${mission.duration} hours</p>
            `;
            break;
    }

    return `
        <div class="col-12 col-md-6 col-xl-4 mb-4">
            <div class="card mission-card ${missionColorClass}" id="mission-${mission.number}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Mission #${mission.number}</h5>
                    <span class="badge bg-warning">In Progress</span>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Mission Type</label>
                        <p class="mb-1"><i class="fas fa-tasks me-2"></i>${mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Aircraft Details</label>
                        <p class="mb-1"><i class="fas fa-plane-departure me-2"></i>${mission.category} - ${mission.model}</p>
                        <p class="mb-1"><i class="fas fa-fighter-jet me-2"></i>${mission.count} Units</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mission Details</label>
                        ${missionDetailsHtml}
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mission Progress</label>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                 role="progressbar" 
                                 style="width: 0%" 
                                 aria-valuenow="0" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">0%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add this new function
function getMissionColorClass(missionType) {
    switch(missionType) {
        case 'payload':
            return 'mission-payload';
        case 'emergency':
            return 'mission-emergency';
        case 'target':
            return 'mission-target';
        case 'rtl':
            return 'mission-rtl';
        case 'forage':
            return 'mission-forage';
        default:
            return '';
    }
}

// Mission simulation function
function simulateMission(missionNumber) {
    const card = document.querySelector(`#mission-${missionNumber}`);
    const progressBar = card.querySelector('.progress-bar');
    const badge = card.querySelector('.badge');
    let progress = 0;
    
    // Check if it's a Forage mission
    const missionType = card.querySelector('.card-body').textContent.includes('Forage');
    const willSucceed = !missionType; // Will fail if it's Forage mission
    
    // Set color immediately based on mission type
    if (willSucceed) {
        progressBar.classList.add('bg-success');
    } else {
        progressBar.classList.add('bg-danger');
    }
    
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);

        if (progress >= 100) {
            clearInterval(interval);
            progressBar.classList.remove('progress-bar-animated', 'progress-bar-striped');
            badge.classList.remove('bg-warning');
            
            if (willSucceed) {
                badge.classList.add('bg-success');
                badge.textContent = 'Completed';
                showToast(`Mission #${missionNumber} completed successfully!`, 'success');
            } else {
                badge.classList.add('bg-danger');
                badge.textContent = 'Failed';
                showToast(`Mission #${missionNumber} failed! Forage missions are risky!`, 'danger');
            }
        }
    }, 20); // 2 seconds simulation
}

const missionFields = {
    payload: `
        <div class="mb-3">
            <label class="form-label">Payload Weight (kg)</label>
            <input type="number" class="form-control" id="payloadWeight" required min="1" max="1000">
            <div class="form-text">Maximum weight: 1000kg</div>
        </div>
        <div class="mb-3">
            <label class="form-label">Delivery Distance (km)</label>
            <input type="number" class="form-control" id="deliveryDistance" required min="1" max="5000">
            <div class="form-text">Maximum distance: 5000km</div>
        </div>
    `,
    emergency: `
        <div class="mb-3">
            <label class="form-label">Supply Type</label>
            <select class="form-select" id="supplyType" required>
                <option value="">Select Supply Type</option>
                <option value="medical">Medical</option>
                <option value="food">Food</option>
                <option value="water">Water</option>
                <option value="shelter">Shelter</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Population to Serve</label>
            <input type="number" class="form-control" id="population" required min="1">
        </div>
        <div class="mb-3">
            <label class="form-label">Urgency Level</label>
            <select class="form-select" id="urgencyLevel" required>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </div>
    `,
    target: `
        <div class="mb-3">
            <label class="form-label">Target Type</label>
            <select class="form-select" id="targetType" required>
                <option value="static">Static</option>
                <option value="mobile">Mobile</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Threat Level</label>
            <select class="form-select" id="threatLevel" required>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Civilian Proximity (meters)</label>
            <input type="number" class="form-control" id="civilianProximity" required min="0">
        </div>
    `,
    rtl: `
        <div class="mb-3">
            <label class="form-label">Current Distance (km)</label>
            <input type="number" class="form-control" id="currentDistance" required min="1">
        </div>
        <div class="mb-3">
            <label class="form-label">Fuel Status (%)</label>
            <input type="number" class="form-control" id="fuelStatus" required min="0" max="100">
        </div>
        <div class="mb-3">
            <label class="form-label">Priority Level</label>
            <select class="form-select" id="priorityLevel" required>
                <option value="emergency">Emergency</option>
                <option value="standard">Standard</option>
            </select>
        </div>
    `,
    forage: `
        <div class="mb-3">
            <label class="form-label">Search Radius (km)</label>
            <input type="number" class="form-control" id="searchRadius" required min="1">
        </div>
        <div class="mb-3">
            <label class="form-label">Resource Type</label>
            <select class="form-select" id="resourceType" required>
                <option value="intel">Intel</option>
                <option value="supplies">Supplies</option>
                <option value="survivors">Survivors</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Duration (hours)</label>
            <input type="number" class="form-control" id="duration" required min="1">
        </div>
    `
};

// Add event listener for mission type selection
document.getElementById('missionType')?.addEventListener('change', function() {
    const dynamicFields = document.getElementById('dynamicFields');
    dynamicFields.innerHTML = missionFields[this.value] || '';
});

// Function to show toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toast = toastContainer.lastElementChild;
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
} 