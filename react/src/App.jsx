import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const categories = [
  { nev: "apród", ar: 850 },
  { nev: "főnemes", ar: 950 },
  { nev: "király", ar: 1250 },
  { nev: "lovag", ar: 1150 },
];

const initialPizzas = [
  { nev: "Áfonyás", kategorianev: "király", vegetarianus: 0 },
  { nev: "Babos", kategorianev: "lovag", vegetarianus: 0 },
  { nev: "Barbecue chicken", kategorianev: "lovag", vegetarianus: 0 },
  { nev: "Betyáros", kategorianev: "király", vegetarianus: 0 },
  { nev: "Caribi", kategorianev: "apród", vegetarianus: 0 },
  { nev: "Csupa sajt", kategorianev: "lovag", vegetarianus: 1 },
  { nev: "Gombás", kategorianev: "apród", vegetarianus: 1 },
  { nev: "Hawaii", kategorianev: "főnemes", vegetarianus: 0 },
  { nev: "Kívánság", kategorianev: "lovag", vegetarianus: 1 },
  { nev: "Magvas", kategorianev: "király", vegetarianus: 1 },
  { nev: "Mexikói", kategorianev: "főnemes", vegetarianus: 0 },
  { nev: "Quattro", kategorianev: "király", vegetarianus: 0 },
  { nev: "Sajtos", kategorianev: "apród", vegetarianus: 1 },
  { nev: "Son-go-ku", kategorianev: "főnemes", vegetarianus: 1 },
  { nev: "Szalámis", kategorianev: "apród", vegetarianus: 0 },
  { nev: "Tonhalas", kategorianev: "lovag", vegetarianus: 0 },
  { nev: "Vega", kategorianev: "lovag", vegetarianus: 1 },
  { nev: "Zöldike", kategorianev: "főnemes", vegetarianus: 1 },
];

const emptyPizza = { eredetiNev: "", nev: "", kategorianev: "", vegetarianus: 0 };
const apiUrl = "api.php";

function priceOf(categoryName) {
  return categories.find((category) => category.nev === categoryName)?.ar ?? 0;
}

function PizzaForm({ value, onChange, onSubmit, onCancel, submitText }) {
  return (
    <form className="react-form" onSubmit={onSubmit}>
      <label>
        Pizza neve
        <input
          value={value.nev}
          onChange={(event) => onChange({ ...value, nev: event.target.value })}
          required
        />
      </label>
      <label>
        Kategória
        <select
          value={value.kategorianev}
          onChange={(event) => onChange({ ...value, kategorianev: event.target.value })}
          required
        >
          <option value="">Válassz...</option>
          {categories.map((category) => (
            <option key={category.nev} value={category.nev}>
              {category.nev} - {category.ar} Ft
            </option>
          ))}
        </select>
      </label>
      <label className="react-check">
        <input
          type="checkbox"
          checked={Number(value.vegetarianus) === 1}
          onChange={(event) => onChange({ ...value, vegetarianus: event.target.checked ? 1 : 0 })}
        />
        Vegetáriánus
      </label>
      <button type="submit">{submitText}</button>
      <button type="button" className="muted-button" onClick={onCancel}>
        Új rögzítés
      </button>
    </form>
  );
}

function PizzaCards({ pizzas, onEdit, onDelete }) {
  return (
    <div className="pizza-grid">
      {pizzas.map((pizza) => (
        <article className="pizza-card" key={pizza.nev}>
          <h3>{pizza.nev}</h3>
          <p>
            <strong>Kategória:</strong> {pizza.kategorianev}
          </p>
          <p>
            <strong>Ár:</strong> {priceOf(pizza.kategorianev).toLocaleString("hu-HU")} Ft
          </p>
          <p>
            <strong>Típus:</strong> {Number(pizza.vegetarianus) === 1 ? "vegetáriánus" : "nem vegetáriánus"}
          </p>
          <button type="button" onClick={() => onEdit(pizza)}>
            Szerkesztés
          </button>
          <button type="button" onClick={() => onDelete(pizza.nev)}>
            Törlés
          </button>
        </article>
      ))}
    </div>
  );
}

function ReactCrudApp() {
  const [pizzas, setPizzas] = useState(initialPizzas);
  const [form, setForm] = useState(emptyPizza);
  const [message, setMessage] = useState("Az adatok React állapotban, tömbben vannak tárolva.");

  function reset() {
    setForm(emptyPizza);
  }

  function save(event) {
    event.preventDefault();
    const payload = {
      ...form,
      nev: form.nev.trim(),
      vegetarianus: Number(form.vegetarianus),
    };
    if (!payload.nev || !payload.kategorianev) return;

    if (payload.eredetiNev) {
      setPizzas((current) =>
        current.map((pizza) => (pizza.nev === payload.eredetiNev ? payload : pizza))
      );
      setMessage("Pizza módosítva a React tömbben.");
    } else {
      if (pizzas.some((pizza) => pizza.nev.toLowerCase() === payload.nev.toLowerCase())) {
        setMessage("Ilyen nevű pizza már létezik.");
        return;
      }
      setPizzas((current) => [...current, payload].sort((a, b) => a.nev.localeCompare(b.nev, "hu")));
      setMessage("Új pizza hozzáadva a React tömbhöz.");
    }
    reset();
  }

  return (
    <section className="react-page">
      <h1>React CRUD</h1>
      <p>A választott pizza-adatbázis adatai helyi React állapotban szerepelnek.</p>
      <PizzaForm
        value={form}
        onChange={setForm}
        onSubmit={save}
        onCancel={reset}
        submitText={form.eredetiNev ? "Módosítás mentése" : "Hozzáadás"}
      />
      <p className="status success">{message}</p>
      <PizzaCards
        pizzas={pizzas}
        onEdit={(pizza) => setForm({ ...pizza, eredetiNev: pizza.nev })}
        onDelete={(name) => {
          setPizzas((current) => current.filter((pizza) => pizza.nev !== name));
          setMessage("Pizza törölve a React tömbből.");
        }}
      />
    </section>
  );
}

function AxiosCrudApp() {
  const [pizzas, setPizzas] = useState([]);
  const [form, setForm] = useState(emptyPizza);
  const [message, setMessage] = useState("Betöltés...");

  async function load() {
    try {
      const response = await axios.get(apiUrl);
      setPizzas(Array.isArray(response.data) ? response.data : []);
      setMessage("Adatok betöltve MySQL adatbázisból Axios segítségével.");
    } catch {
      setMessage("Nem sikerült kapcsolódni az API-hoz. Futtasd a setup.sql fájlt a pizza_db adatbázishoz.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function reset() {
    setForm(emptyPizza);
  }

  async function save(event) {
    event.preventDefault();
    const payload = {
      ...form,
      nev: form.nev.trim(),
      vegetarianus: Number(form.vegetarianus),
    };

    try {
      if (payload.eredetiNev) {
        await axios.put(apiUrl, payload);
        setMessage("Pizza módosítva az adatbázisban.");
      } else {
        await axios.post(apiUrl, payload);
        setMessage("Pizza hozzáadva az adatbázishoz.");
      }
      reset();
      await load();
    } catch (error) {
      setMessage(error.response?.data?.error || "Sikertelen mentés.");
    }
  }

  async function deletePizza(name) {
    try {
      await axios.delete(apiUrl, { data: { nev: name } });
      setMessage("Pizza törölve az adatbázisból.");
      await load();
    } catch {
      setMessage("A törlés nem sikerült.");
    }
  }

  return (
    <section className="react-page">
      <h1>React és Axios CRUD</h1>
      <p>Az adatok szerveroldalon, MySQL adatbázisban vannak, a kéréseket Axios küldi a PHP API-nak.</p>
      <PizzaForm
        value={form}
        onChange={setForm}
        onSubmit={save}
        onCancel={reset}
        submitText={form.eredetiNev ? "Módosítás mentése" : "Hozzáadás"}
      />
      <p className="status">{message}</p>
      <PizzaCards
        pizzas={pizzas}
        onEdit={(pizza) => setForm({ ...pizza, eredetiNev: pizza.nev })}
        onDelete={deletePizza}
      />
    </section>
  );
}

function Calculator() {
  const [category, setCategory] = useState(categories[0].nev);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState(true);
  const total = priceOf(category) * quantity + (delivery ? 690 : 0);

  return (
    <section className="tool-panel">
      <h2>Pizza árkalkulátor</h2>
      <label>
        Kategória
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item.nev} value={item.nev}>
              {item.nev} - {item.ar} Ft
            </option>
          ))}
        </select>
      </label>
      <label>
        Darab
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
        />
      </label>
      <label className="react-check">
        <input type="checkbox" checked={delivery} onChange={(event) => setDelivery(event.target.checked)} />
        Kiszállítás
      </label>
      <p className="result-box">{total.toLocaleString("hu-HU")} Ft</p>
    </section>
  );
}

function MemoryGame() {
  const base = ["Sajtos", "Hawaii", "Mexikói", "Vega"];
  const [cards, setCards] = useState(() =>
    [...base, ...base].sort(() => Math.random() - 0.5).map((name, index) => ({
      id: index,
      name,
      open: false,
      matched: false,
    }))
  );
  const [selected, setSelected] = useState([]);

  function flip(card) {
    if (card.open || card.matched || selected.length === 2) return;
    const opened = cards.map((item) => (item.id === card.id ? { ...item, open: true } : item));
    const nextSelected = [...selected, card.id];
    setCards(opened);
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      const [firstId, secondId] = nextSelected;
      const first = opened.find((item) => item.id === firstId);
      const second = opened.find((item) => item.id === secondId);
      setTimeout(() => {
        setCards((current) =>
          current.map((item) => {
            if (item.id !== firstId && item.id !== secondId) return item;
            return first.name === second.name ? { ...item, matched: true } : { ...item, open: false };
          })
        );
        setSelected([]);
      }, 650);
    }
  }

  function restart() {
    setCards([...base, ...base].sort(() => Math.random() - 0.5).map((name, index) => ({
      id: index,
      name,
      open: false,
      matched: false,
    })));
    setSelected([]);
  }

  return (
    <section className="tool-panel">
      <h2>Pizza memóriajáték</h2>
      <div className="memory-grid">
        {cards.map((card) => (
          <button
            type="button"
            key={card.id}
            className={card.open || card.matched ? "memory-card open" : "memory-card"}
            onClick={() => flip(card)}
          >
            {card.open || card.matched ? card.name : "?"}
          </button>
        ))}
      </div>
      <button type="button" onClick={restart}>
        Új játék
      </button>
    </section>
  );
}

function SpaApp() {
  const [active, setActive] = useState("calculator");
  const ActiveTool = useMemo(() => (active === "calculator" ? Calculator : MemoryGame), [active]);

  return (
    <section className="react-page">
      <h1>React SPA</h1>
      <p>Két React alkalmazás egy oldalon, komponensekkel és useState állapotkezeléssel.</p>
      <div className="spa-tabs">
        <button type="button" className={active === "calculator" ? "active" : ""} onClick={() => setActive("calculator")}>
          Kalkulátor
        </button>
        <button type="button" className={active === "memory" ? "active" : ""} onClick={() => setActive("memory")}>
          Memóriajáték
        </button>
      </div>
      <ActiveTool />
    </section>
  );
}

export default function App() {
  const mode = document.getElementById("root")?.dataset.app;
  if (mode === "axios-crud") return <AxiosCrudApp />;
  if (mode === "spa") return <SpaApp />;
  return <ReactCrudApp />;
}
