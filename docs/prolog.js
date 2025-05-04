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