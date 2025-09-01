describe('EventHub smoke', () => {
  it('loads home and navigates', () => {
    cy.visit('/');
    cy.contains('Featured Events');
    cy.get('a,button').contains(/Browse Events|Events/).first().click();
    cy.url().should('include', '/events');
  });

  it('shows login and register pages', () => {
    cy.visit('/login');
    cy.contains('Welcome Back');
    cy.visit('/register');
    cy.contains('Join EventHub');
  });
});