$(document).ready(() => { getItemsfromDb() });
$('.packer-btn').click((event) => saveItem(event));

const getItemsfromDb = async () => {
  const url = `/api/v1/items`;
  const items = await fetchAndParse(url);

  items.forEach(item => {
    prependItem(item)
  });
}

const saveItem = (event) => {
  event.preventDefault();

  const name = $('.packer-txt-input').val();
  const item = {
    name,
    status: 'not packed'
  };
  const savedItem = saveItemToDb(item);

  prependItem(savedItem);
};

const saveItemToDb = (item) => {
  const url = `/api/v1/items`;

  return postAndParse(url, item);
};

const prependItem = (item) => {
  const itemTemp = `
    <article class="item-card">
      <div class="item-name-section">
        <h4 class="item-name">${item.name}</h4>
        <button class="delete-item-btn" id=${item.id}>Delete</button>
      </div>
      <div class="item-pack-status">
        <input type="checkbox" name="packed-status" id="pack-status">
        <label for="pack-status">Packed</label>
      </div>
    </article>`;

  $('.item-container').prepend(itemTemp);
};

const fetchAndParse = async (url) => {
  const initialFetch = await fetch(url);
  return await initialFetch.json();
};

const postAndParse = async (url, data) => {
  const initialFetch = await fetch(url, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  });

  return await initialFetch.json();
};