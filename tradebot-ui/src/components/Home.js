import React from 'react';

import PageLayout from './PageLayout';

function Home() {
  return (
    <PageLayout
      pageTitle='Home'
      selectedMenuItem='home'
      breadcrumbs={['home']}
    >
      <h1>Welcome home!</h1>
    </PageLayout>      
  )
}

export default Home;
