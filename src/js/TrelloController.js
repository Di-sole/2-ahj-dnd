/* eslint-disable class-methods-use-this */

export default class TrelloController {
  constructor(board) {
    this.board = board;
    this.draggedEl = null;

    this.todoColumn = this.board.querySelector('.todo');
    this.progressColumn = this.board.querySelector('.progress');
    this.doneColumn = this.board.querySelector('.done');
  }

  start() {
    const todoCards = JSON.parse(localStorage.todo);
    const progressCards = JSON.parse(localStorage.progress);
    const doneCards = JSON.parse(localStorage.done);

    this.drawCards(this.todoColumn, todoCards);
    this.drawCards(this.progressColumn, progressCards);
    this.drawCards(this.doneColumn, doneCards);

    this.addBoardListeners();
  }

  addBoardListeners() {
    this.board.addEventListener('click', (e) => {
      e.preventDefault();
      this.onBoardClick(e.target);
    });

    this.board.addEventListener('mousedown', (e) => {
      this.onMouseDown(e);
    });

    this.board.addEventListener('mousemove', (e) => {
      e.preventDefault();
      this.onMouseMove(e);
    });

    this.board.addEventListener('mouseup', () => {
      this.onMouseUp();
    });

    this.board.addEventListener('mouseleave', () => {
      this.onMouseLeave();
    });
  }

  drawCards(column, cards) {
    const cardsList = column.querySelector('.cards-list');

    cards.forEach((str) => {
      const card = this.createCard(str);
      cardsList.appendChild(card);
    });
  }

  createCard(text) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.textContent = text;

    card.addEventListener('mouseenter', (e) => this.showDeleteBtn(e.target));
    card.addEventListener('mouseleave', (e) => this.hideDeleteBtn(e.target));

    return card;
  }

  createCardSpace(elem) {
    const ghost = document.createElement('li');
    ghost.className = 'card-space';
    ghost.style.height = `${elem.offsetHeight}px`;

    return ghost;
  }

  addCard(elem) {
    const cardsList = elem.closest('.column').querySelector('.cards-list');
    const textArea = elem.closest('.add-card-form').querySelector('.add-card-textarea');

    if (textArea.value) {
      const text = textArea.value;
      const card = this.createCard(text);
      cardsList.appendChild(card);
    }

    textArea.value = '';
  }

  resetCard(elem) {
    const card = elem;

    card.style.width = '';
    card.dataset.leftNum = '';
    card.dataset.topNum = '';
    card.style.left = '';
    card.style.top = '';
    card.classList.remove('dragged');
  }

  deleteCard(elem) {
    elem.closest('.card').remove();
  }

  onBoardClick(elem) {
    if (elem.classList.contains('delete-btn')) {
      this.deleteCard(elem);
    }

    if (elem.classList.contains('add-card-link')) {
      this.showForm(elem);
    }

    if (elem.classList.contains('cancel-btn')) {
      this.hideForm(elem);
    }

    if (elem.classList.contains('add-card-btn')) {
      this.addCard(elem);
      this.hideForm(elem);
    }
  }

  onMouseDown(evnt) {
    if (evnt.target.classList.contains('delete-btn')) {
      return;
    }

    if (evnt.target.closest('.card')) {
      document.body.style.cursor = 'grabbing';

      this.draggedEl = evnt.target.closest('.card');
      this.draggedEl.style.width = `${this.draggedEl.offsetWidth - 20}px`;
      this.draggedEl.dataset.leftNum = evnt.pageX - this.draggedEl.offsetLeft;
      this.draggedEl.dataset.topNum = evnt.pageY - this.draggedEl.offsetTop;

      this.draggedEl.classList.add('dragged');

      this.draggedEl.style.left = `${evnt.pageX - this.draggedEl.dataset.leftNum}px`;
      this.draggedEl.style.top = `${evnt.pageY - this.draggedEl.dataset.topNum}px`;
    }
  }

  onMouseMove(evnt) {
    if (this.draggedEl) {
      this.draggedEl.style.left = `${evnt.pageX - this.draggedEl.dataset.leftNum}px`;
      this.draggedEl.style.top = `${evnt.pageY - this.draggedEl.dataset.topNum}px`;

      const container = evnt.target.closest('.cards-list');
      const spaceEl = document.querySelector('.card-space');

      if (container && !spaceEl) {
        const space = this.createCardSpace(this.draggedEl);
        const closest = evnt.target.closest('.card');
        container.insertBefore(space, closest);
      }

      if (spaceEl && evnt.target !== spaceEl) {
        spaceEl.remove();
      }
    }
  }

  onMouseUp() {
    const space = document.querySelector('.card-space');

    if (space) {
      const container = space.closest('.cards-list');
      container.insertBefore(this.draggedEl, space);
      space.remove();
    }

    if (this.draggedEl) {
      this.resetCard(this.draggedEl);
      this.draggedEl = null;
      document.body.style.cursor = 'default';
    }
  }

  onMouseLeave() {
    if (this.draggedEl) {
      this.resetCard(this.draggedEl);
      this.draggedEl = null;
      document.body.style.cursor = 'default';
    }
  }

  showDeleteBtn(elem) {
    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.innerText = String.fromCharCode(0x274C);
    elem.appendChild(btn);
  }

  hideDeleteBtn(elem) {
    const btn = elem.querySelector('.delete-btn');
    btn.remove();
  }

  showForm(elem) {
    const form = elem.closest('.column-footer').querySelector('.add-card-form');
    form.classList.remove('hidden');
    elem.classList.add('hidden');
  }

  hideForm(elem) {
    const form = elem.closest('.add-card-form');
    const addCardLink = elem.closest('.column-footer').querySelector('.add-card-link');
    form.classList.add('hidden');
    addCardLink.classList.remove('hidden');
  }

  saveToStorage() {
    const todoCards = this.todoColumn.querySelectorAll('.card');
    const progressCards = this.progressColumn.querySelectorAll('.card');
    const doneCards = this.doneColumn.querySelectorAll('.card');

    const todo = [];
    const progress = [];
    const done = [];

    todoCards.forEach((card) => todo.push(card.innerText));
    progressCards.forEach((card) => progress.push(card.innerText));
    doneCards.forEach((card) => done.push(card.innerText));

    localStorage.todo = JSON.stringify(todo);
    localStorage.progress = JSON.stringify(progress);
    localStorage.done = JSON.stringify(done);
  }
}
