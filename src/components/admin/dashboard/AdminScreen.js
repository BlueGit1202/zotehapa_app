import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import BackendNavbar from '../../layouts/backend/BackendNavbarComponent';
import SidebarMenu from '../../layouts/backend/BackendMenuComponent';
import Chatbot from "../../Chatbot";
import DashboardScreen from './DashboardComponent';
import ProductListComponent from '../products/ProductListComponent';
import CustomerListComponent from "../customers/CustomerListComponent";
import EmployeeListComponent from "../employees/EmployeeListComponent";
import TransactionListComponent from "../transactions/TransactionListComponent";

const DefaultComponent = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleNavigation = (url) => {
    // Extract the component name from the URL
    const componentMap = {
      'dashboard': 'dashboard',
      'products': 'products',
      'customers': 'customers',
      'employees': 'employees',
      'transactions': 'transactions'
    };
    
    // Find the matching component
    const matchedComponent = Object.keys(componentMap).find(key => 
      url.toLowerCase().includes(key)
    );
    
    if (matchedComponent) {
      setActiveComponent(componentMap[matchedComponent]);
    }
    setShowSidebar(false);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'products':
        return <ProductListComponent />;
      case 'customers':
        return <CustomerListComponent />;
      case 'employees':
        return <EmployeeListComponent />;
      case 'transactions':
        return <TransactionListComponent />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar at the top */}
      <View style={styles.headerWrapper}>
        <BackendNavbar 
          toggleSidebar={toggleSidebar} 
          showSidebar={showSidebar}
        />
      </View>

      {/* Sidebar Menu */}
      {showSidebar && (
        <SidebarMenu 
          onClose={toggleSidebar} 
          onNavigate={handleNavigation}
        />
      )}

      {/* Overlay when sidebar is open */}
      {showSidebar && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View>
            {renderComponent()}
          </View>
        </ScrollView>
      </View>

      {/* Chatbot floating button */}
      <Chatbot style={styles.chatbot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 900,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 60,
    marginBottom: 60,
  },
  scrollContent: {
    paddingBottom: 0,
  },
});

export default DefaultComponent;