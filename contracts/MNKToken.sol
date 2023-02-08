// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./openzeppelin/ERC20.sol";
import "./openzeppelin/Ownable.sol";
import "./openzeppelin/ERC20Burnable.sol";
import "./openzeppelin/ERC20Capped.sol";

contract MKNToken is ERC20Burnable, Ownable, ERC20Capped {

    uint private _cap = 7300000 * (10 ** decimals());

    constructor() ERC20("MKN Token", "MKN") ERC20Capped(_cap) {

    }

    function mint(uint amount) public onlyOwner {
        _mint(_msgSender(), amount);
    }

    function _mint(address account, uint256 amount) internal virtual override (ERC20, ERC20Capped) {
        super._mint(account, amount);
    }

}