describe('Sign Builder Canvas Tools', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('adds and removes a rectangle', () => {
    cy.contains('Add Rectangle').click();
    cy.get('canvas').should('exist');
    cy.contains('Delete Selected').click();
  });

  it('adds and centers text', () => {
    cy.contains('Add Text').click();
    cy.contains('Align Center').click();
    cy.get('canvas').should('exist');
  });
});
