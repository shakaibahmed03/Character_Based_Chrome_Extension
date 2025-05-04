// Variables to track state
let spriteContainer = null;
let popupMenu = null;
let taskPopup = null;
let isDragging = false;
let offsetX, offsetY;
let isPopupOpen = false;
let isTaskPopupOpen = false;

// Function to create and inject the sprite container
function createSpriteContainer() {
  if (spriteContainer) return; // Already exists
  
  // Create container div - making it transparent with no visible elements
  spriteContainer = document.createElement('div');
  spriteContainer.id = 'interactive-sprite-container';
  spriteContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    height: 300px;
    z-index: 2147483647;
    border: none;
    background: transparent;
    box-shadow: none;
    user-select: none;
    overflow: visible;
  `;
  
  // Create the iframe with the Spline sprite
  const spriteIframe = document.createElement('iframe');
  spriteIframe.src = 'https://my.spline.design/robotcat-53c678c5de84109a0d9f2fe44b94d4b6/';
  spriteIframe.frameBorder = '0';
  spriteIframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    pointer-events: auto;
  `;
  
  // Add a small draggable area in the center of the sprite
  const dragHandle = document.createElement('div');
  dragHandle.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: move;
    z-index: 2147483648;
    background-color: rgba(255, 255, 255, 0.01);
  `;
  
  // Add a clickable area below the drag handle
  const clickArea = document.createElement('div');
  clickArea.style.cssText = `
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 2147483648;
    background-color: rgba(255, 255, 255, 0.01);
  `;
  
  // Create popup menu (initially hidden) positioned at the top right
  popupMenu = document.createElement('div');
  popupMenu.style.cssText = `
    position: absolute;
    top: 0;
    right: -120px;
    width: 200px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 10px;
    z-index: 2147483649;
    display: none;
  `;
  
  // Create task popup (initially hidden) positioned at the top right
  taskPopup = document.createElement('div');
  taskPopup.style.cssText = `
    position: absolute;
    top: 0;
    right: -250px;
    width: 240px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 15px;
    z-index: 2147483649;
    display: none;
    font-family: Arial, sans-serif;
  `;
  
  // Create task popup content
  const taskPopupTitle = document.createElement('h3');
  taskPopupTitle.textContent = 'Set Task Reminder';
  taskPopupTitle.style.cssText = `
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
  `;
  
  // Task description input
  const taskInput = document.createElement('textarea');
  taskInput.placeholder = 'Enter task description';
  taskInput.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
    font-family: Arial, sans-serif;
    resize: vertical;
    min-height: 60px;
    box-sizing: border-box;
  `;
  
  // Date and time container
  const dateTimeContainer = document.createElement('div');
  dateTimeContainer.style.cssText = `
    display: flex;
    margin-bottom: 15px;
    gap: 8px;
  `;
  
  // Date input with calendar icon
  const dateContainer = document.createElement('div');
  dateContainer.style.cssText = `
    position: relative;
    flex: 1;
    max-width: 110px;
  `;
  
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  dateInput.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 13px;
  `;
  
  // Time input with clock icon
  const timeContainer = document.createElement('div');
  timeContainer.style.cssText = `
    position: relative;
    flex: 1;
    max-width: 110px;
  `;
  
  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeInput.value = `${hours}:${minutes}`;
  timeInput.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 13px;
  `;
  
  // Set reminder button
  const reminderButton = document.createElement('button');
  reminderButton.textContent = 'Set Reminder';
  reminderButton.style.cssText = `
    width: 100%;
    padding: 10px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  `;
  
  reminderButton.addEventListener('mouseover', () => {
    reminderButton.style.backgroundColor = '#3367d6';
  });
  
  reminderButton.addEventListener('mouseout', () => {
    reminderButton.style.backgroundColor = '#4285f4';
  });
  
  reminderButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const taskDescription = taskInput.value;
    const taskDate = dateInput.value;
    const taskTime = timeInput.value;
    
    if (taskDescription.trim() === '') {
      alert('Please enter a task description');
      return;
    }
    
    alert(`Task reminder set!\n\nTask: ${taskDescription}\nDate: ${taskDate}\nTime: ${taskTime}`);
    hideTaskPopup();
  });
  
  // Add close button for task popup
  const closeTaskButton = document.createElement('div');
  closeTaskButton.innerHTML = '×';
  closeTaskButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  `;
  
  closeTaskButton.addEventListener('click', (e) => {
    e.stopPropagation();
    hideTaskPopup();
  });
  
  // Assemble the date and time containers
  dateContainer.appendChild(dateInput);
  timeContainer.appendChild(timeInput);
  dateTimeContainer.appendChild(dateContainer);
  dateTimeContainer.appendChild(timeContainer);
  
  // Assemble the task popup
  taskPopup.appendChild(closeTaskButton);
  taskPopup.appendChild(taskPopupTitle);
  taskPopup.appendChild(taskInput);
  taskPopup.appendChild(dateTimeContainer);
  taskPopup.appendChild(reminderButton);
  
  // Add menu options
  const options = [
    { text: 'Set Tasks / Reminders', action: 'setTasks' },
    { text: 'Edit Tasks / Manage Tasks', action: 'editTasks' },
    { text: 'Chat', action: 'chat' }
  ];
  
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.text;
    button.dataset.action = option.action;
    button.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 8px;
      border: none;
      border-radius: 4px;
      background-color: #f5f5f5;
      cursor: pointer;
      text-align: left;
      font-family: Arial, sans-serif;
      font-size: 14px;
      transition: background-color 0.2s;
    `;
    
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#e0e0e0';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#f5f5f5';
    });
    
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing the popup when button is clicked
      handleMenuAction(option.action);
    });
    
    popupMenu.appendChild(button);
  });
  
  // Make the drag handle draggable
  dragHandle.addEventListener('mousedown', startDragging);
  
  // Make the click area open the popup menu
  clickArea.addEventListener('click', togglePopupMenu);
  
  // Close popups when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (isPopupOpen && !popupMenu.contains(e.target) && e.target !== clickArea) {
      hidePopupMenu();
    }
    if (isTaskPopupOpen && !taskPopup.contains(e.target)) {
      hideTaskPopup();
    }
  });
  
  // Append elements
  spriteContainer.appendChild(spriteIframe);
  spriteContainer.appendChild(dragHandle);
  spriteContainer.appendChild(clickArea);
  spriteContainer.appendChild(popupMenu);
  spriteContainer.appendChild(taskPopup);
  document.body.appendChild(spriteContainer);
}

// Function to toggle popup menu
function togglePopupMenu(e) {
  e.stopPropagation();
  if (isPopupOpen) {
    hidePopupMenu();
  } else {
    hideTaskPopup(); // Hide task popup if open
    showPopupMenu();
  }
}

// Function to show popup menu
function showPopupMenu() {
  if (popupMenu) {
    popupMenu.style.display = 'block';
    isPopupOpen = true;
  }
}

// Function to hide popup menu
function hidePopupMenu() {
  if (popupMenu) {
    popupMenu.style.display = 'none';
    isPopupOpen = false;
  }
}

// Function to show task popup
function showTaskPopup() {
  if (taskPopup) {
    taskPopup.style.display = 'block';
    isTaskPopupOpen = true;
  }
}

// Function to hide task popup
function hideTaskPopup() {
  if (taskPopup) {
    taskPopup.style.display = 'none';
    isTaskPopupOpen = false;
  }
}

// Function to handle menu actions
function handleMenuAction(action) {
  console.log(`Action triggered: ${action}`);
  // Implement the specific actions here
  switch(action) {
    case 'setTasks':
      hidePopupMenu(); // Hide the main popup
      showTaskPopup(); // Show the task popup
      break;
    case 'editTasks':
      alert('Edit Tasks feature will be implemented here');
      hidePopupMenu();
      break;
    case 'chat':
      alert('Chat feature will be implemented here');
      hidePopupMenu();
      break;
  }
}

// Function to start dragging
function startDragging(e) {
  e.preventDefault();
  e.stopPropagation();
  isDragging = true;
  
  // Calculate the offset of the mouse cursor from the container's top-left corner
  const rect = spriteContainer.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  
  // Add event listeners for dragging and releasing
  document.addEventListener('mousemove', dragSprite);
  document.addEventListener('mouseup', stopDragging);
}

// Function to drag the sprite
function dragSprite(e) {
  if (!isDragging) return;
  
  e.preventDefault();
  
  // Calculate new position
  const newX = e.clientX - offsetX;
  const newY = e.clientY - offsetY;
  
  // Set new position
  spriteContainer.style.left = `${Math.max(0, newX)}px`;
  spriteContainer.style.top = `${Math.max(0, newY)}px`;
  
  // Remove the right position once we've started dragging
  if (spriteContainer.style.right) {
    spriteContainer.style.right = '';
  }
}

// Function to stop dragging
function stopDragging() {
  isDragging = false;
  document.removeEventListener('mousemove', dragSprite);
  document.removeEventListener('mouseup', stopDragging);
}

// Create sprite as soon as content script loads
createSpriteContainer(); 