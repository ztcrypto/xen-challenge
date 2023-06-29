class BorrowersController < ApplicationController
  def index
    borrowers = Borrower.all
    render json: borrowers
  end
end
