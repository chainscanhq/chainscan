use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct NumberAccount {
    /// List of stored numbers
    pub numbers: Vec<u64>, // store large numbers in a vector
}

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,      // Public key of the account the program was loaded into
    accounts: &[AccountInfo], // The account where data is stored
    instruction_data: &[u8],  // Data input to the program
) -> ProgramResult {
    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to modify
    let account = next_account_info(accounts_iter)?;

    // Ensure the account is owned by the program
    if account.owner != program_id {
        msg!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Check if the instruction data is for saving a number or fetching
    if instruction_data.len() == 8 {
        // Save the number
        let number = u64::from_le_bytes(instruction_data.try_into().unwrap());
        let mut number_account = NumberAccount::try_from_slice(&account.data.borrow())?;

        // Add the new number to the stored list
        number_account.numbers.push(number);
        number_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

        msg!("Number {} saved!", number);
    } else {
        // Fetch numbers (if instruction_data is empty)
        let number_account = NumberAccount::try_from_slice(&account.data.borrow())?;

        if number_account.numbers.is_empty() {
            msg!("No numbers saved.");
        } else {
            msg!("Stored numbers: {:?}", number_account.numbers);
        }
    }

    Ok(())
}

// Sanity tests
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;

    #[test]
    fn test_sanity() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<NumberAccount>() + 100]; // Allocating enough space for data
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let mut accounts = vec![account];

        // Test saving number 18292939339393
        let num1: u64 = 18292939339393;
        let instruction_data = num1.to_le_bytes().to_vec();
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();

        let number_account = NumberAccount::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(number_account.numbers, vec![num1]);

        // Test saving another number 2827373
        let num2: u64 = 2827373;
        let instruction_data = num2.to_le_bytes().to_vec();
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();

        let number_account = NumberAccount::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(number_account.numbers, vec![num1, num2]);

        // Test fetching stored numbers
        process_instruction(&program_id, &accounts, &[]).unwrap();
    }
}
