function toDoListApp() {

    // Variabel
    const create = document.querySelector('.create');
    const input = document.querySelector('.input input');
    const btnShowInput = document.querySelector('.left button');
    const closeIcon = document.querySelector('.create header p');
    const btnCreateList = document.querySelector('#create');
    const listColor = document.querySelectorAll('.color span');

    // Listener
    btnShowInput.addEventListener('click', () => showInputAlert(create, input));
    input.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            createList(input);
            closeList(create, input);
        };
    });
    btnCreateList.addEventListener('click', () => {
        createList(input);
        closeList(create, input);
    });
    closeIcon.addEventListener('click', () => closeList(create, input));
    listColor.forEach(color => {
        color.addEventListener('click', function() {
            const colorId = color.id;
            switch (colorId) {
                case "yellow":
                    input.style.backgroundColor = '#ffffa9';
                    input.focus();
                    break;
                case "green":
                    input.style.backgroundColor = '#b4ffb4';
                    input.focus();
                    break;
                case "blue":
                    input.style.backgroundColor = '#a3ceff';
                    input.focus();
                    break;
                case "black":
                    input.style.backgroundColor = '#6d6d6d';
                    input.focus();
                    break;
                case "grey":
                    input.style.backgroundColor = '#d3d3d3';
                    input.focus();
                    break;
                case "white":
                    input.style.backgroundColor = '#ffffff';
                    input.focus();
                    break;
            };
            for (let i = 0; i < listColor.length; i++) listColor[i].classList.remove('active');
            this.classList.add('active');
        });
    });

    document.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('list')) target.classList.toggle('completed');
        if (target.classList.contains('fa-trash')) removeList(target);
    })

    // Function
    const showInputAlert = (e, i) => {
        e.classList.toggle('active');
        setTimeout(() => i.focus(), 15);
    };

    function closeList(create, input) {
        create.classList.remove('active');
        input.value = '';
    };

    function createList(inputValue) {
        if (inputValue.value === "") return;
        else {
            const listContainer = document.querySelector('.list-container');
            const div = document.createElement('div');
            div.classList.add('list');
            div.style.backgroundColor = input.style.backgroundColor;
            div.innerHTML = list(inputValue.value);
            listContainer.appendChild(div);
        }
    };

    function removeList(target) {
        let list = target.parentElement.parentElement;
        list.classList.add('remove');
        list.addEventListener('transitionend', () => list.remove());
    }

    function list(e) {
        return `<p>${e}</p>
                    <span>
                        <i class="fas fa-pen"></i>
                        <i class="fas fa-trash"></i>
                    </span>`
    };
}
toDoListApp();