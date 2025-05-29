import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import opticianImage from './optician.jpg';
import { 
  FaTachometerAlt as DashboardIcon,
  FaUsers as ClientsIcon,
  FaCalendarAlt as Appointments,
  FaFilePrescription as OrdonnancesIcon,
  FaShoppingCart as SalesIcon,
  FaBoxOpen as PurchasesIcon,
  FaFileInvoice as InvoicesIcon,
  FaClipboardList as OrdersIcon,
  FaGlasses as ProductsIcon,
  FaCashRegister as CashIcon,
  FaWarehouse as StockIcon,
  FaTruck as DeliveryIcon,
  FaTag as BrandIcon,
  FaStore as ShopIcon,
  FaTruckLoading as SuppliersIcon,
  FaMoneyBillWave as SecondaryCashIcon,
  FaUserCog as ProfileIcon
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="opticien-sidebar">
      <div className="sidebar-profile">
          <img src={opticianImage} 
          alt="Profile"
          className="sidebar-profile-pic"
        />
        <h3>Ahmeed</h3>
        <p>Opticien</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/opticien" 
              end
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/client"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <ClientsIcon />
              <span>Clients</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/prescriptions"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <OrdonnancesIcon />
              <span>Ordonnances</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/appointments"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <Appointments />
              <span>Rendez-vous</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/products"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <ProductsIcon />
              <span>Produits</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/orders"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <OrdersIcon />
              <span>Commandes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/purchases"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <PurchasesIcon />
              <span>Achats</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/sales"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <SalesIcon />
              <span>Ventes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/invoices"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <InvoicesIcon />
              <span>Factures</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/cashregistration"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <CashIcon />
              <span>Caisse</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/stock"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <StockIcon />
              <span>Stock</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/brand"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <BrandIcon />
              <span>Marques</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/shop"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <ShopIcon />
              <span>Boutique</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/suppliers"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <SuppliersIcon />
              <span>Fournisseurs</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/delivery"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <DeliveryIcon />
              <span>Livreurs</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/opticien/profile"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <ProfileIcon />
              <span>Profil</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;