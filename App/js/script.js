function toDoListApp() {

    const listContainer = document.querySelector('.create');
    const input = document.querySelector('.margin .input textarea');
    const btnShowInput = document.querySelector('.left button');
    let editable = false;

    function showInput() {
        const closeIcon = document.querySelector('.create header p');
        btnShowInput.addEventListener('click', () => {
            defaultText();
            showInputAlert(listContainer, input);
        });
        listContainer.addEventListener('keyup', (e) => {
            if (e.keyCode == 13) {
                createList(input.value);
                closeList(listContainer, input);
            };
        });
        closeIcon.addEventListener('click', () => closeList(listContainer, input));
    }
    showInput();

    const showInputAlert = (e, i) => {
        e.classList.toggle('active');
        setTimeout(function() {
            i.focus();
        }, 10)
    };

    function closeList(listContainer, input) {
        listContainer.classList.remove('active');
        input.value = '';
    };

    function createList(inputValue) {
        const listContainer = document.querySelector('.list-container');
        const div = document.createElement('div');
        div.classList.add('list');
        div.innerHTML = list(inputValue);
        listContainer.appendChild(div);
    };

    function list(e) {
        return `<p>${e}</p>
                    <span>
                        <i class="fas fa-pen"></i>
                        <i class="fas fa-trash"></i>
                    </span>`
    };

    function showEditAlert(target) {
        const listValue = target.parentElement.previousElementSibling;
        showInputAlert(listContainer, input);
        SetText();
        button.forEach(e => {
            e.classList.contains('remove') ? e.remove() : listContainer.lastElementChild.appendChild(createBtnCancel);
        });
        input.value = listValue.textContent;
    }

    function SetText() {
        const textInP = document.querySelector('.input p');
        const button = document.querySelectorAll('.margin button');
        const createBtnCancel = document.createElement('button');
        createBtnCancel.classList.add('remove');
        createBtnCancel.textContent = 'Cancel';
        button[0].textContent = 'Edit List';
        textInP.textContent = 'Edit List';
    }

    function defaultText() {
        SetText;
        createBtnCancel.remove();
        button[0].textContent = 'Create List';
        textInP.textContent = 'Create List';
    }

    function documentListener() {
        document.addEventListener('click', function(e) {
            let target = e.target;
            if (target.classList.contains('fa-pen')) {
                editable = true;
                showEditAlert(target);
                changeList(editable, target);
            };
        })
    }
    documentListener();

    function changeList(editable, target) {
        listContainer.addEventListener('click', function(e) {
            if (e.target.id == 'create' && editable == true) {
                const listValue = target.parentElement.previousElementSibling;
                listValue.textContent = input.value;
                closeList(listContainer, input);
            } else if (e.target.id == 'create' && editable == false) {
                createList(input.value);
                closeList(listContainer, input);
            }
        })
    };
    changeList(editable);
}
toDoListApp();