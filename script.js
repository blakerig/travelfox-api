//fetch('database.json')
//.then(response => response.json())
//  .then(data => {
    // Dump JSON into list
//    data.forEach(item => {
//      const li = document.createElement('li');
//      li.textContent = "ooo";
//      jsonList.appendChild(li);
//    });
//  })
//  .catch(error => {
//    console.error('Error loading JSON:', error);
//  });


    fetch('/destinations')
      .then(response => response.json())
      .then(data => {
        const list = document.getElementById('destination-list');
        data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.name;
          list.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching destinations:', error));