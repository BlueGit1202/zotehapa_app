import React from 'react';
import { View } from 'react-native';
import ContactUsComponent from '../page/ContactUsComponent';

const TemplateManagerComponent = ({ menuTemplateId }) => {
  return (
    <View>
      {menuTemplateId === 1 && <ContactUsComponent />}
    </View>
  );
};

export default TemplateManagerComponent;