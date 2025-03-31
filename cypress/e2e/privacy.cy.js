it("testa a página da política de privacidade de forma independente", () => {
    cy.visit("./src/privacy.html").title()
        .should("be.equal", "Central de Atendimento ao Cliente TAT - Política de privacidade")
        .get("#title").should("have.text", "CAC TAT - Política de privacidade")
        .get("#white-background").should("be.visible")
});