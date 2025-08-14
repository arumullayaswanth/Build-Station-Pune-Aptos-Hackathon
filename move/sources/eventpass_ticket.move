/// This module implements an NFT ticketing system for events.
module eventpass_ticket::EventPassTicket {
    use std::string::{Self, String};
    use aptos_framework::aptos_account;
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::resource_account;
    use aptos_framework::token;

    /// Error codes
    const ECOLLECTION_NOT_FOUND: u64 = 1;
    const ETICKET_MINT_FAILED: u64 = 2;

    /// Event emitted when a new ticket is minted.
    struct TicketMinted has drop, store {
        event_name: String,
        ticket_id: u64,
        recipient_address: address,
    }

    /// Public entry function to mint an NFT ticket.
    /// It creates the collection if it doesn't exist and then mints a new ticket.
    public entry fun mint_ticket(
        creator: &signer,
        event_name: String,
        recipient_address: address,
    ) {
        let creator_address = aptos_account::address_of(creator);
        let collection_name = string::utf8(b"EventPass Tickets");
        let collection_uri = string::utf8(b"https://eventpass.com/collection");
        let collection_description = string::utf8(b"NFT tickets for EventPass events");

        // Check if collection exists, if not, create it
        if (!token::collection_exists(creator_address, collection_name)) {
            token::create_collection(
                creator,
                collection_name,
                collection_description,
                collection_uri,
                option::some(token::royalty::new(creator_address, 0)), // No royalty for simplicity
                token::mutable_collection_fields::new(
                    true, // mutability_config.description
                    true, // mutability_config.uri
                    true, // mutability_config.max_supply
                    true, // mutability_config.mutable_royalty
                    true, // mutability_config.default_properties
                    true, // mutability_config.token_standard
                    true, // mutability_config.token_supply
                ),
            );
        };

        // Generate a unique token name based on event name and a timestamp (for simplicity, using a dummy ID here)
        let token_name = string::format(b"{} #{} ", [event_name, string::utf8(b"1"), ]); // Placeholder for unique ID
        let token_uri = string::format(b"https://eventpass.com/ticket/{}", [token_name]);
        let token_description = string::format(b"Ticket for {} event", [event_name]);

        // Mint the token
        let new_token_id = token::mint_token(
            creator,
            collection_name,
            token_name,
            token_description,
            token_uri,
            option::none(), // default_properties
            token::mutable_token_fields::new(
                true, // mutability_config.description
                true, // mutability_config.name
                true, // mutability_config.uri
                true, // mutability_config.royalty
                true, // mutability_config.properties
            ),
            1, // amount
            recipient_address,
        );

        // Emit a TicketMinted event
        event::emit(TicketMinted {
            event_name,
            ticket_id: object::id_from_handle(new_token_id),
            recipient_address,
        });
    }
}


