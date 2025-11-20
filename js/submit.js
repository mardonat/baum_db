const form = document.getElementById('messungForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const baumID = document.getElementById('baum').value.trim();
    const daten = document.getElementById('daten').value.trim();
    const timestamp = new Date().toISOString();

    const filePath = `baum-${baumID}/messungen.md`;
    const commitMessage = `Messung Baum ${baumID} am ${timestamp}`;

    // GitHub Token (du musst ein Personal Access Token erstellen)
    const token = "GH_TOKEN_HIER_EINFÜGEN";

    // Hole aktuelle Datei
    const repo = "DEINNAME/DEINREPO";
    const branch = "main";

    const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
    let sha = null;
    let content = "";

    try {
        const res = await fetch(getUrl, { headers: { Authorization: `token ${token}` }});
        if(res.ok){
            const data = await res.json();
            sha = data.sha;
            content = atob(data.content);
        }
    } catch(err){}

    content += `\n## ${timestamp}\n${daten}\n`;

    const putBody = {
        message: commitMessage,
        content: btoa(content),
        branch: branch
    };
    if(sha) putBody.sha = sha;

    await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: { Authorization: `token ${token}` },
        body: JSON.stringify(putBody)
    });

    alert('Messung erfolgreich gespeichert!');
    form.reset();
});
