import React from "react";
import styled from "styled-components";
// import Sidebar from "./Sidebar";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fff;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.main`
  flex: 1;
  background: #fff;
  overflow: auto;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      {/* <Sidebar /> */}
      <MainContent>
         <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;
