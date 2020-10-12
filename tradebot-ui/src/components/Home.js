import React from 'react';

import { ApiBase } from '../apiconf';
import PageLayout from './PageLayout';

function getAccounts() {
}

function Home() {
  return (
    <PageLayout
      pageTitle='Home'
      selectedMenuItem='home'
      breadcrumbs={['home']}
    >    
    </PageLayout>      
  )
}

export default Home;
