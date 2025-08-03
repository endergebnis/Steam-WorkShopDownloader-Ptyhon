(function () {
  const workshopUrl = window.location.href;
  const detailPageContainer = document.querySelector(".game_area_purchase_game > div");

  if (detailPageContainer && !document.querySelector("#DownloadWithPythonButton")) {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "🎮 Herunterladen";
    downloadButton.id = "DownloadWithPythonButton";

    Object.assign(downloadButton.style, {
      marginTop: "10px",
      padding: "10px 20px",
      backgroundColor: "#a83232",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "14px",
      display: "inline-block"
    });

    downloadButton.addEventListener("click", () => {
      fetch("http://localhost:5005/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: workshopUrl })
      })
        .then((res) => res.json())
        .then((data) => alert("Workshop wird heruntergeladen (ID: " + data.id + ")"))
        .catch((err) => alert("Fehler beim Senden: " + err.message));
    });

    detailPageContainer.appendChild(downloadButton);
  }

  document.querySelectorAll(".workshopItem").forEach((item) => {
    if (item.querySelector(".DownloadWithPythonButton")) return;

    const link = item.querySelector("a.ugc");
    if (!link) return;
    const url = link.href;

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "⬇️";
    downloadButton.className = "DownloadWithPythonButton";

    Object.assign(downloadButton.style, {
      position: "absolute",
      top: "8px",
      right: "8px",
      backgroundColor: "#a83232",
      color: "white",
      border: "none",
      borderRadius: "2px",
      padding: "4px 6px",
      fontSize: "12px",
      cursor: "pointer",
      display: "true",
      zIndex: "10"
    });

    downloadButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      fetch("http://localhost:5005/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
        .then((res) => res.json())
        .then((data) => alert("Workshop wird heruntergeladen (ID: " + data.id + ")"))
        .catch((err) => alert("Fehler beim Senden: " + err.message));
    });

    const preview = item.querySelector(".workshopItemPreviewHolder");
    if (preview) {
      preview.style.position = "relative";
      preview.appendChild(downloadButton);

      item.addEventListener("mouseenter", () => {
        downloadButton.style.display = "block";
      });
      item.addEventListener("mouseleave", () => {
        downloadButton.style.display = "none";
      });
    }
  });
})();
