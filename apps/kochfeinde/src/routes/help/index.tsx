import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/help/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1>Rezepte schreiben – Syntax</h1>
      <p className="mt-2">
        Rezepte werden in <strong>Markdown</strong> verfasst. Der Editor
        verwendet{' '}
        <a
          href="https://commonmark.org/help/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          CommonMark
        </a>
        , ergänzt um spezielle Erweiterungen für Zutaten und Skalierung.
      </p>

      <h2>Zutaten auflisten</h2>
      <p>
        Zutaten werden als <strong>ungeordnete Liste</strong> (<code>-</code>) notiert.
        Format: <code>- Menge Einheit [Name](/ingredient/&lt;slug&gt;)</code>
      </p>
      <pre className="bg-base-200 p-3 rounded-md overflow-x-auto">
{`- 2.5 EL [Zucker](/ingredient/zucker)
- 500 g [Mehl](/ingredient/mehl)
- 3 [Eier](/ingredient/eier)`}
      </pre>
      <p>
        Fehlt die Zutat in der DB, schreibst du den Namen in eckige Klammern
        <strong> ohne </strong> Link:
      </p>
      <pre className="bg-base-200 p-3 rounded-md overflow-x-auto">
{`- 1 Prise [Salz]
- 2 EL [Olivenöl]`}
      </pre>

      <h3>Unterstützte Einheiten</h3>
      <table className="table table-zebra mt-2">
        <thead>
          <tr>
            <th>Kategorie</th>
            <th>Einheiten</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Volumen</td>
            <td>
              <code>l</code>, <code>ml</code>, <code>el</code>, <code>tl</code>,{' '}
              <code>cup</code>, <code>tsp</code>, <code>tbsp</code>, <code>fl oz</code>,{' '}
              <code>pt</code>, <code>qt</code>, <code>gal</code>
            </td>
          </tr>
          <tr>
            <td>Gewicht</td>
            <td>
              <code>g</code>/<code>gramm</code>, <code>kg</code>, <code>mg</code>,{' '}
              <code>oz</code>, <code>lb</code>
            </td>
          </tr>
          <tr>
            <td>Stück</td>
            <td>
              <em>keine Einheit</em> – wird automatisch als Stück erkannt
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Mengen &amp; Skalierung</h2>
      <p>
        Zahlen werden automatisch an die Portionsanzahl angepasst. Dezimaltrennzeichen:
        Punkt (<code>.</code>) oder Komma (<code>,</code>). Mit <code>!</code> nach
        einer Zahl schliesst du sie von der Skalierung aus:
      </p>
      <pre className="bg-base-200 p-3 rounded-md overflow-x-auto">
{`Backen bei 180! °C für 20! Minuten`}
      </pre>

      <h2>Zubereitungsschritte</h2>
      <p>
        Schritte als <strong>nummerierte Liste</strong>. Zutaten können verlinkt
        werden (dienen dann der Navigation zur Zutatenseite):
      </p>
      <pre className="bg-base-200 p-3 rounded-md overflow-x-auto">
{`1. [Zwiebeln](/ingredient/zwiebeln) fein würfeln.
2. [Olivenöl] in einer Pfanne erhitzen.`}
      </pre>

      <h2>Tags</h2>
      <p>
        Beim Bearbeiten kannst du Tags wie <em>VEGAN</em>, <em>EASY</em> oder{' '}
        <em>ITALIAN</em> setzen. Sie werden als Badges angezeigt.
      </p>

      <h2>Style Guide</h2>
      <p>Empfohlene Struktur für ein Rezept:</p>
      <pre className="bg-base-200 p-3 rounded-md overflow-x-auto">
{`# Zutaten
## Palak
- 400 g [Paneer](/ingredient/paneer)
- 2 [Zwiebel](/ingredient/zwiebel-(geduenstet))
- 1 [Knoblauchzehe](/ingredient/knoblauch)
- 20 g [Ingwer](/ingredient/ingwer)
- 1 [Tomate](/ingredient/tomate)
- 600 g [Rahmspinat](/ingredient/rahmspinat)
- 2 EL [Naturjoghurt](/ingredient/naturjoghurt)

## Gewürze
- Etwas Salz
- 1 TL Korianderpulver
- 1 TL Kurkumapulver
- 1 TL Beliebiges Curry

# Vorbereitung
Die Zwiebeln, Knoblauch und Ingwer schälen. Zwiebeln und Tomaten in kleine Würfel schneiden, Ingwer reiben und Knoblauch pressen. 

Das Panner auch in Würfel schneiden

# Zubereitung
## Schritt 1!
> - Alle Gewürze
> - 2 Gewürfelte Zwiebeln
> - Knoblauch und Ingwer

Etwas Bratbutter oder Öl in einer tiefen Pfanne erhitzen, alle Gewürze dazugeben und kurz rösten. Zwiebeln, Knoblauch und Ingwer beifügen, glasig dünsten. Tomaten kurz mitdünsten. 

## Schritt 2!
> - 600 g Spinat
> - 2 dl Wasser
> - 2 EL Joghurt

Blattspinat und Wasser zugeben. Sobald der Spinat aufgetaut ist, mit einem Pürierstab alles fein pürieren. Mit Joghurt und Salz abschmecken, 10 Minuten auf kleinster Stufe köcheln. 

## Schritt 3!
> - 400 g Paneer

Paneer in Würfel schneiden und anschließend in einer Pfanne goldbraun braten 

## Schritt 4!
Paneer zur Spinatmasse geben und sorgfältig mischen. Mit Reis und nach Belieben Chiliflocken servieren. 
`}
      </pre>

      <h3>Konventionen</h3>
      <ul>
        <li>
          <strong>Zutaten</strong> – mit <code># Zutaten</code> überschreiben,
          nach Bedarf in Untergruppen gliedern (<code>## Palak</code>,{' '}
          <code>## Gewürze</code>).
        </li>
        <li>
          <strong>Vorbereitung</strong> – separates Kapitel für Schnibbelarbeit,
          Einweichen etc.
        </li>
        <li>
          <strong>Zubereitung</strong> – Schritte mit <code>## Schritt 1!</code>,
          <code>## Schritt 2!</code> etc. nummerieren. Das <code>!</code> verhindert
          die Skalierung der Schrittnummer.
        </li>
        <li>
          <strong>Blockquote vor Schritt</strong> – mit <code>&gt;</code> eingerückte
          Liste der benötigten Zutaten für diesen Schritt. So sieht man auf einen
          Blick, was man braucht.
        </li>
        <li>
          Nach der Blockquote folgt der Fliesstext mit der eigentlichen Anleitung.
        </li>
      </ul>

      <h2>Weitere Formatierungen</h2>
      <ul>
        <li>
          <strong>Fett</strong> <code>**Text**</code> (<kbd className="kbd kbd-sm">Ctrl+B</kbd>)
        </li>
        <li>
          <em>Kursiv</em> <code>*Text*</code> (<kbd className="kbd kbd-sm">Ctrl+I</kbd>)
        </li>
        <li>
          <a href="#">Links</a> <code>[Text](url)</code> (<kbd className="kbd kbd-sm">Ctrl+K</kbd>)
        </li>
      </ul>

      <p className="mt-8 text-sm text-base-content/60">
        <a
          href="https://commonmark.org/help/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          CommonMark Hilfe
        </a>
        {' · '}
        <a
          href="https://commonmark.org/help/tutorial/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          CommonMark Tutorial
        </a>
      </p>
    </div>
  )
}
