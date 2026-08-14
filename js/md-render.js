/**
 * MD-RENDER — conversor minimalista de Markdown a HTML.
 * Cubre lo que el contenido del curso usa: #/##/###, **negrita**,
 * *cursiva*, > citas, listas -, tablas |, --- y párrafos.
 * No es un parser completo de Markdown — es intencionalmente simple
 * para no depender de librerías externas.
 */
window.mdToHtml = function (md) {
  var lines = md.replace(/\r\n/g, '\n').split('\n');
  var html = [];
  var inList = false;
  var inTable = false;
  var tableRows = [];

  function inline(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function closeList() {
    if (inList) { html.push('</ul>'); inList = false; }
  }

  function closeTable() {
    if (inTable) {
      var out = '<table>';
      tableRows.forEach(function (row, i) {
        var tag = i === 0 ? 'th' : 'td';
        out += '<tr>' + row.map(function (c) { return '<' + tag + '>' + inline(c.trim()) + '</' + tag + '>'; }).join('') + '</tr>';
      });
      out += '</table>';
      html.push(out);
      tableRows = [];
      inTable = false;
    }
  }

  lines.forEach(function (raw) {
    var line = raw.trim();

    if (/^\|(.+)\|$/.test(line)) {
      if (/^\|[\s:-]+\|$/.test(line)) return; // separador |---|---|
      inTable = true;
      tableRows.push(line.replace(/^\||\|$/g, '').split('|'));
      return;
    } else if (inTable) {
      closeTable();
    }

    if (line === '') { closeList(); return; }

    if (/^---+$/.test(line)) { closeList(); html.push('<hr>'); return; }

    var h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      closeList();
      var level = h[1].length;
      html.push('<h' + level + '>' + inline(h[2].replace(/\*\*/g, '')) + '</h' + level + '>');
      return;
    }

    var bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      closeList();
      html.push('<blockquote>' + inline(bq[1]) + '</blockquote>');
      return;
    }

    var li = line.match(/^[-*]\s+(.*)$/);
    if (li) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push('<li>' + inline(li[1]) + '</li>');
      return;
    }

    closeList();
    html.push('<p>' + inline(line) + '</p>');
  });

  closeList();
  closeTable();
  return html.join('\n');
};
