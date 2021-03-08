class AuthorizationError extends Error {
    constructor() {
        super("");
    }
}

class WrongPasswordError extends Error {
    constructor() {
        super("Wrong password was specified");
    }
}

class NotFound extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    WrongPasswordError,
    AuthorizationError,
    NotFound,
};
