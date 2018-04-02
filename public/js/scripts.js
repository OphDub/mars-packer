$(document).ready(async () => {
  await getItemsFromDb();
});
$('.packer-btn').click((event) => saveItem(event));
$(document).on('click', '.delete-item-btn', (event) => {
  removeItem(event);
});

const getItemsFromDb = async () => {
  const url = `/api/v1/items`;
  const items = await fetchAndParse(url);

  await items.forEach(item => {
    prependItem(item);
  });
};

const saveItem = async (event) => {
  event.preventDefault();
  $('.info-container').text('');

  const name = $('.packer-txt-input').val();
  const item = { name, status: 'not packed' };

  if(!validateItem(name)) {
    return
  }

  const savedItem = await saveItemToDb(item);

  await prependItem(savedItem);
};

const validateItem = (itemName) => {
  if (itemName === '') {
    const errorMsg = `Give your item a name.`;

    $('.info-container').text(errorMsg);
    return false;
  }

  return true;
}

const saveItemToDb = async (itemInfo) => {
  const url = `/api/v1/items`;

  return await postAndParse(url, {item: itemInfo});
};

const removeItem = (event) => {
  event.preventDefault();

  const { id } = event.target;
  const card = event.target.parentElement.parentElement;

  $(card).remove();
  deleteItemFromDb(id);
};

const deleteItemFromDb = async (id) => {
  const url = `/api/v1/items/${id}`;
  deleteAndParse(url);
};

const prependItem = (item) => {
  const status = item.status === 'packed' ? `checked="checked"` : null;

  const itemTemp = `
    <article class="item-card">
      <div class="item-name-section">
        <h4 class="item-name">${item.name}</h4>
        <button class="delete-item-btn" id=${item.id}>Delete</button>
      </div>
      <div class="item-pack-status">
        <input type="checkbox" name="packed-status" id="pack-status" ${status}>
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

const deleteAndParse = async (url) => {
  const initialFetch = await fetch(url, {
    method: 'DELETE'
  });

  return await initialFetch.json();
};