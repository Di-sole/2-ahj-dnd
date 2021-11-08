import TrelloController from './TrelloController';

if (localStorage.length === 0) {
  localStorage.setItem('todo', JSON.stringify(['Welcome to trello!', 'This is a card.', "Click on a card to see what's behind it."]));
  localStorage.setItem('progress', JSON.stringify(['Invite your team to this board using the Add Members button', "Drag people onto a card to indicate that they're responsible for it."]));
  localStorage.setItem('done', JSON.stringify(['To learn more tricks, check out the guide.', "Use as many boards as you want. We'll make more!"]));
}

const board = document.querySelector('.board');
const trello = new TrelloController(board);
trello.start();

window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  trello.saveToStorage();
});
