pragma solidity ^0.4.8;
/**
 * @title ROSCA on a blockchain. ver. Lite
 *
 * A ROSCA (Rotating and Savings Credit Association) is an agreement between
 * trusted friends to contribute funds on a periodic basis to a "pot", and in
 * each round one of the participants receives the pot (termed "winner").
 *
 * Supports ETH.
 */
contract ROSCA {
    ////////////////////
    // STORAGE VARIABLES
    ////////////////////

    // ROSCA parameters
    uint256 public roundPeriodInSecs;
    uint16 public currentRound;  // set to 0 when ROSCA is created, becomes 1 when ROSCA starts
    uint128 public contributionSize;
    uint256 internal roundStartTime;

    bool public endOfROSCA = false;

    address internal winnerAddress = 0x0;
    uint256 internal lowestBid;

    mapping(address => User) internal members;
    address[] public membersAddresses;  // for iterating through members' addresses
    mapping(address => string) memberNames;

    struct User {
        uint256 credit;  // amount of funds user has contributed - winnings (not including discounts) so far
        bool debt; // true if user won the pot while not in good standing and is still not in good standing
        bool paid; // yes if the member had won a Round
        bool alive; // needed to check if a member is indeed a member
    }

    ////////////
    // MODIFIERS
    ////////////
    modifier onlyFromMember {
        if (!members[msg.sender].alive) {
            throw;
        }
        _;
    }

    modifier onlyIfRoscaNotEnded {
        if (endOfROSCA) {
            throw;
        }
        _;
    }

    ////////////
    // FUNCTIONS
    ////////////

    /**
      * @dev Creates a new ROSCA and initializes the necessary variables. ROSCA starts after startTime.
      * Creator of the contract becomes foreperson but not a participant (unless creator's address
      *   is included in members_ parameter).
      *
      *
      * If erc20TokenContract is 0, ETH is taken to be the currency of this ROSCA. Otherwise, this
      * contract assumes `erc20tokenContract` specifies an ERC20-compliant token contract.
      * Note it's the creator's responsibility to check that the provided contract is ERC20 compliant and that
      * it's safe to use.
      */
    function ROSCA(
    uint128 contributionSize_,
    string userName) {

        // for the purposes of the demo
        roundPeriodInSecs = 30;

        contributionSize = contributionSize_;

        roundStartTime = now;

        addMember(msg.sender, userName);
    }

    function addMember(address newMember, string userName) public {
        if (members[newMember].alive || currentRound > 0) {  // already registered or registration closed
            throw;
        }
        members[newMember] = User({paid: false , credit: 0, alive: true, debt: false});
        membersAddresses.push(newMember);
        memberNames[newMember] = userName;
    }

    function checkRoundCanAdvance () returns (bool) {
        uint256 roundEndTime = roundStartTime + roundPeriodInSecs;
        if (now < roundEndTime ) {  // too early to start a new round.
            return false;
        }
        // allow the round To Advance if all members have contributed
        for (uint16 i = 0; i < membersAddresses.length; i++) {
            if (members[membersAddresses[i]].credit < (currentRound * contributionSize)) {
                return false;
            }
        }
        return true;
    }

    /**
      * @dev Calculates the winner of the current round's pot, and credits her.
      * If there were no bids during the round, winner is selected semi-randomly.
      * Priority is given to non-delinquent participants.
      */
    function startRound() onlyIfRoscaNotEnded returns (bool success) {
        if (!checkRoundCanAdvance()) {
            return false;
        }

        if (currentRound != 0) {
            cleanUpPreviousRound();
        }
        if (currentRound < membersAddresses.length) {
            currentRound++;
        } else {
            endOfROSCA = true;
        }
        roundStartTime = now;
    }

    function cleanUpPreviousRound() internal {
        uint256 winnerIndex;
        uint16 numUnpaidParticipants = uint16(membersAddresses.length) - (currentRound - 1);

        winnerIndex = findSemiRandomWinner(numUnpaidParticipants);

        // We keep the unpaid participants at positions [0..num_participants - current_round) so that we can uniformly select
        // among them (if we didn't do that and there were a few consecutive paid participants, we'll be more likely to select the
        // next unpaid member).
        swapWinner(winnerIndex, numUnpaidParticipants - 1);

        creditWinner();
    }

    function creditWinner() internal {
        members[winnerAddress].credit += lowestBid;
        members[winnerAddress].paid = true;
    }

    function findSemiRandomWinner(uint16 numUnpaidParticipants) internal returns (uint256) {
        address delinquentWinner = 0x0;
        uint256 winnerIndex;
        // There was no bid in this round. Find an unpaid address for this epoch.
        // Give priority to members in good standing (not delinquent).
        // Note this randomness does not require high security, that's why we feel ok with using the block's timestamp.
        // Everyone will be paid out eventually.
        uint256 semi_random = now % numUnpaidParticipants;
        for (uint16 i = 0; i < numUnpaidParticipants; i++) {
            uint256 index = (semi_random + i) % numUnpaidParticipants;
            address candidate = membersAddresses[index];
            if (!members[candidate].paid) {
                winnerIndex = index;
                if (members[candidate].credit >= (currentRound * contributionSize)) {
                    // We found a non-delinquent winner.
                    winnerAddress = candidate;
                    break;
                }
                delinquentWinner = candidate;
            }
        }
        if (winnerAddress == 0) {  // we did not find any non-delinquent winner.
            // Perform some basic sanity checks.
            if (delinquentWinner == 0 || members[delinquentWinner].paid) throw;
            winnerAddress = delinquentWinner;
            // Set the flag to true so we know this user cannot withdraw until debt has been paid.
            members[winnerAddress].debt = true;
        }
        // Set lowestBid to the right value since there was no winning bid.
        lowestBid = contributionSize * membersAddresses.length;
        return winnerIndex;
    }

    // Swaps membersAddresses[winnerIndex] with membersAddresses[indexToSwap]. However,
    // if winner was selected through a bid, winnerIndex was not set, and we find it first.
    function swapWinner(
    uint256 winnerIndex, uint256 indexToSwap) internal {
        // We now want to swap winnerIndex with indexToSwap, but we already know membersAddresses[winnerIndex] == winnerAddress.
        membersAddresses[winnerIndex] = membersAddresses[indexToSwap];
        membersAddresses[indexToSwap] = winnerAddress;
    }

    /**
     * Processes a periodic contribution. msg.sender must be one of the participants and will thus
     * identify the contributor.
     *
     * Any excess funds are withdrawable through withdraw() without fee.
     */
    function contribute() payable onlyFromMember onlyIfRoscaNotEnded external {
        if (currentRound > 0) {
            startRound(); // try to advance the round
        }
        User member = members[msg.sender];
        uint256 value = msg.value;
        member.credit += value;
        if (member.debt) {
            // Check if user comes out of debt. We know they won an entire pot as they could not bid,
            // so we check whether their credit w/o that winning is non-delinquent.
            // check that credit must defaultPot (when debt is set to true, defaultPot was added to credit as winnings) +
            // currentRound in order to be out of debt
            uint256 requiredContributions = currentRound * contributionSize;
            if (member.credit - (membersAddresses.length * contributionSize) >= requiredContributions) {
                member.debt = false;
            }
        }
    }

    /**
     * Withdraws available funds for msg.sender.
     */
    function withdraw() onlyFromMember external returns (bool success) {
        if (currentRound > 0) {
            startRound(); // try to advance the round
        }
        if (members[msg.sender].debt && !endOfROSCA) {  // delinquent winners need to first pay their debt
            throw;
        }
        uint256 totalCredit = members[msg.sender].credit;

        uint256 totalDebit = members[msg.sender].debt
        ? (membersAddresses.length * contributionSize)  // this must be end of rosca
        : currentRound * contributionSize;
        if (totalDebit >= totalCredit) {  // nothing to withdraw
            throw;
        }

        uint256 amountToWithdraw = totalCredit - totalDebit;
        uint256 amountAvailable = this.balance;

        if (amountAvailable < amountToWithdraw) {
            // This may happen if some participants are delinquent.
            amountToWithdraw = amountAvailable;
        }
        members[msg.sender].credit -= amountToWithdraw;
        if (!msg.sender.send(amountToWithdraw)) {   // if the send() fails, restore the allowance
            // No need to call throw here, just reset the amount owing. This may happen
            // for nonmalicious reasons, e.g. the receiving contract running out of gas.
            members[msg.sender].credit += amountToWithdraw;
            return false;
        }
        return true;
    }

    /**
     * Returns how much a user can withdraw (positive return value),
     * or how much they need to contribute to be in good standing (negative return value)
     */
    function getParticipantBalance(address user) external constant returns(int256) {
        int256 totalCredit = int256(members[user].credit);

        // if rosca have ended, we don't need to subtract as totalDebit should equal to default winnings
        if (members[user].debt && !endOfROSCA) {
            totalCredit -= int256(membersAddresses.length * contributionSize);
        }
        int256 totalDebit = int256(currentRound * contributionSize);

        return totalCredit - totalDebit;
    }

    function getMemberCount() returns (uint memberCount) {
        return membersAddresses.length;
    }

    function getUserName(uint index) returns (string userName) {
        return memberNames[membersAddresses[index]];
    }
}