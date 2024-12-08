module investment_contract {
    use std::signer;
    use std::vector;
    use std::string::{Self, String};

    // Constants
    const VERSION: u8 = 1;
    const DEFAULT_ROUND_UP_PERCENTAGE: u8 = 1;
    const DEFAULT_DAILY_DEPOSIT: u64 = 100;

    // Errors
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_INVESTMENT_TOOL_DISABLED: u64 = 2;

    // Resource to store contract state
    struct InvestmentContract has key {
        version: u8,
        round_up_percentage: u8,
        daily_deposit: u64,
        user_balances: vector<UserBalance>,
        investment_tools: vector<InvestmentTool>
    }

    // Struct to represent user balance
    struct UserBalance has store, drop {
        user_address: address,
        balance: u64
    }

    // Struct to represent investment tools
    struct InvestmentTool has store, drop {
        name: String,
        enabled: bool
    }

    // Initialize the contract
    public fun initialize(account: &signer) {
        let contract = InvestmentContract {
            version: VERSION,
            round_up_percentage: DEFAULT_ROUND_UP_PERCENTAGE,
            daily_deposit: DEFAULT_DAILY_DEPOSIT,
            user_balances: vector::empty(),
            investment_tools: vector::from_array([
                InvestmentTool { name: string::utf8(b"stocks"), enabled: true },
                InvestmentTool { name: string::utf8(b"mutual_funds"), enabled: true },
                InvestmentTool { name: string::utf8(b"crypto"), enabled: true }
            ])
        };

        move_to(account, contract);
    }

    // Round up function
    public fun round_up(account: &signer, amount: u64) acquires InvestmentContract {
        let contract = borrow_global_mut<InvestmentContract>(signer::address_of(account));
        let round_up_amount = ((amount as u128) * (contract.round_up_percentage as u128) / 100 as u64);

        if (round_up_amount > 0) {
            update_user_balance(account, (round_up_amount as u64));
        }
    }

    // Daily deposit function
    public fun daily_deposit(account: &signer) acquires InvestmentContract {
        let contract = borrow_global_mut<InvestmentContract>(signer::address_of(account));
        update_user_balance(account, contract.daily_deposit);
    }

    // Lumpsum deposit function
    public fun lumpsum_deposit(account: &signer, amount: u64) acquires InvestmentContract {
        update_user_balance(account, amount);
    }

    // Invest function
    public fun invest(account: &signer, investment_type: String, amount: u64) acquires InvestmentContract {
        let user_address = signer::address_of(account);
        let contract = borrow_global_mut<InvestmentContract>(user_address);
        
        // Check user balance
        let user_balance = get_user_balance(user_address);
        if (user_balance < amount) {
            abort E_INSUFFICIENT_BALANCE;
        }

        // Check if investment tool is enabled
        let tool_enabled = vector::any(&contract.investment_tools, |tool| {
            tool.name == investment_type && tool.enabled
        });

        if (!tool_enabled) {
            abort E_INVESTMENT_TOOL_DISABLED;
        }

        // Perform investment by reducing balance
        update_user_balance(account, amount * -1);
    }

    // Update user balance
    fun update_user_balance(account: &signer, amount: u64) acquires InvestmentContract {
        let user_address = signer::address_of(account);
        let contract = borrow_global_mut<InvestmentContract>(user_address);
        
        let user_balance_index = vector::find_index(&contract.user_balances, |balance| {
            balance.user_address == user_address
        });

        match (user_balance_index) {
            Some(index) => {
                let user_balance = vector::borrow_mut(&mut contract.user_balances, index);
                user_balance.balance = (user_balance.balance as u64) + (amount as u64);
            },
            None => {
                vector::push_back(&mut contract.user_balances, UserBalance {
                    user_address: user_address,
                    balance: amount
                });
            }
        }
    }

    // Get user balance
    fun get_user_balance(user_address: address): u64 acquires InvestmentContract {
        let contract = borrow_global<InvestmentContract>(user_address);
        
        let user_balance_index = vector::find_index(&contract.user_balances, |balance| {
            balance.user_address == user_address
        });

        match (user_balance_index) {
            Some(index) => vector::borrow(&contract.user_balances, index).balance,
            None => 0
        }
    }
}