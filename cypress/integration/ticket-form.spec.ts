import ticketFormSelectors from '../selectors/ticket-form'
import { ticketForm, newTicketresponse } from '../fixtures/ticket-form.json'

describe('Ticket form', () => {
    beforeEach(() => {
        cy.visit('')
        cy.get(ticketFormSelectors.nameInput).type(ticketForm.name)
        cy.get(ticketFormSelectors.emailInput).type(ticketForm.email)
        cy.get(ticketFormSelectors.subjectInput).type(ticketForm.subject)
        cy.get(ticketFormSelectors.subjectInput).type(ticketForm.message)
    })

    it('creates new ticket with success status', () => {
        cy.intercept('POST', '/v2/tickets/new', {
            statusCode: newTicketresponse.success.statusCode,
            body: newTicketresponse.success.body,
        }).as('newTicketSuccess')
        cy.get(ticketFormSelectors.ticketForm).submit()
        cy.wait('@newTicketSuccess').then((interception) => {
            expect(interception.response?.body.id).eq(
                newTicketresponse.success.body.id
            )
            expect(interception.response?.statusCode).eq(
                newTicketresponse.success.statusCode
            )
        })
        cy.get(ticketFormSelectors.header)
            .as('header')
            .invoke('text')
            .should('eq', 'Thank you!')
        cy.get('@header')
            .should('have.class', 'success')
            .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('creates new ticket with failure status', () => {
        cy.intercept('POST', '/v2/tickets/new', {
            statusCode: newTicketresponse.failure.statusCode,
            body: newTicketresponse.failure.body,
        }).as('newTicketSuccess')
        cy.get(ticketFormSelectors.ticketForm).submit()
        cy.wait('@newTicketSuccess').then((interception) => {
            expect(interception.response?.body.error).eq(
                newTicketresponse.failure.body.error
            )
            expect(interception.response?.statusCode).eq(
                newTicketresponse.failure.statusCode
            )
        })
        cy.get(ticketFormSelectors.header)
            .as('header')
            .invoke('text')
            .should('eq', 'Error!')
        cy.get('@header')
            .should('have.class', 'fail')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
})
