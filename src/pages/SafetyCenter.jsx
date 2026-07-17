import React, { useEffect, useState } from "react";
import { Home, MapPin, Phone, Plus, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import API from "../api/axios";

const initialAddress = { label: "Home", addressLine: "", city: "", state: "", postalCode: "", primaryAddress: false };
const initialContact = { name: "", phone: "", relationship: "" };

function SafetyCenter() {
  const [addresses, setAddresses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [contactForm, setContactForm] = useState(initialContact);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [addressResponse, contactResponse] = await Promise.all([
        API.get("/addresses"),
        API.get("/emergency-contacts"),
      ]);
      setAddresses(addressResponse.data?.data || []);
      setContacts(contactResponse.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load safety information.");
    }
  };

  useEffect(() => { load(); }, []);

  const saveAddress = async (event) => {
    event.preventDefault();
    try {
      await API.post("/addresses", addressForm);
      setAddressForm(initialAddress);
      setMessage("Address saved successfully.");
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save address."); }
  };

  const saveContact = async (event) => {
    event.preventDefault();
    try {
      await API.post("/emergency-contacts", contactForm);
      setContactForm(initialContact);
      setMessage("Emergency contact saved successfully.");
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save contact."); }
  };

  const remove = async (type, id) => {
    await API.delete(type === "address" ? `/addresses/${id}` : `/emergency-contacts/${id}`);
    await load();
  };

  return (
    <main className="workspace-page">
      <section className="workspace-hero compact">
        <div><span className="workspace-kicker"><ShieldCheck size={16} /> Account safety</span><h1>Safety Center</h1><p>Manage saved locations and trusted emergency contacts.</p></div>
      </section>
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      <div className="workspace-two-column">
        <section className="workspace-card">
          <div className="workspace-card-head"><div><Home size={21} /><h2>Saved addresses</h2></div><span>{addresses.length}</span></div>
          <form className="compact-form" onSubmit={saveAddress}>
            <div className="form-row"><input value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} placeholder="Label (Home/Work)" required /><input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" required /></div>
            <input value={addressForm.addressLine} onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })} placeholder="Complete address" required />
            <div className="form-row"><input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" /><input value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value.replace(/\D/g, "").slice(0, 6) })} placeholder="PIN code" /></div>
            <label className="checkbox-line"><input type="checkbox" checked={addressForm.primaryAddress} onChange={(e) => setAddressForm({ ...addressForm, primaryAddress: e.target.checked })} /> Set as primary address</label>
            <button className="primary-action"><Plus size={17} /> Save address</button>
          </form>
          <div className="mini-list">
            {addresses.map((address) => <article key={address.id}><MapPin size={18} /><div><strong>{address.label}{address.primaryAddress ? " · Primary" : ""}</strong><p>{address.addressLine}, {address.city}</p></div><button onClick={() => remove("address", address.id)}><Trash2 size={17} /></button></article>)}
            {addresses.length === 0 && <p className="muted-state">No saved addresses yet.</p>}
          </div>
        </section>

        <section className="workspace-card">
          <div className="workspace-card-head"><div><UsersRound size={21} /><h2>Emergency contacts</h2></div><span>{contacts.length}</span></div>
          <form className="compact-form" onSubmit={saveContact}>
            <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value.replace(/[^A-Za-z\s]/g, "") })} placeholder="Contact name" required />
            <input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile number" required />
            <input value={contactForm.relationship} onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })} placeholder="Relationship" />
            <button className="primary-action"><Plus size={17} /> Add trusted contact</button>
          </form>
          <div className="mini-list">
            {contacts.map((contact) => <article key={contact.id}><Phone size={18} /><div><strong>{contact.name}</strong><p>{contact.phone} · {contact.relationship || "Trusted contact"}</p></div><button onClick={() => remove("contact", contact.id)}><Trash2 size={17} /></button></article>)}
            {contacts.length === 0 && <p className="muted-state">No emergency contacts yet.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

export default SafetyCenter;
