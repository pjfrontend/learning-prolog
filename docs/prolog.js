window.onload = function () {
    const select = document.getElementById('exampleSelect');
    dropdownOptions.forEach((option, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = option.title;
        select.appendChild(opt);
    });

    // Trigger initial update with the first example
    select.selectedIndex = 0;
    updateExample(0);
};

document.getElementById('exampleSelect').addEventListener('change', function () {
    updateExample(this.value);
});

function updateExample(index) {
    const example = dropdownOptions[index];
    document.getElementById('title').textContent = 'Learning Prolog - '+ example.title;
    document.getElementById('program').value = example.program;
    document.getElementById('query').placeholder = example.placeholder;
    // resetting values
    document.getElementById('query').value = '';
    document.getElementById('output').textContent = '';
}

function runProlog() {
    const program = document.getElementById("program").value;
    const query = document.getElementById("query").value;
    const output = document.getElementById("output");
    output.textContent = "";

    const session = pl.create();

    session.consult(program, {
      success: function () {
        session.query(query, {
          success: function () {
            session.answers(answer => {
              if (answer === false) {
                output.textContent += "No more answers.\n";
              } else {
                output.textContent += session.format_answer(answer) + "\n";
              }
            });
          },
          error: function (err) {
            output.textContent = "Query Error: " + err;
          }
        });
      },
      error: function (err) {
        output.textContent = "Program Error: " + err;
      }
    });
}

addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        runProlog();
    }
});

function saveToFile() {
    var text = document.getElementById("program").value;
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "knowledge_base.txt";
    link.click();
}