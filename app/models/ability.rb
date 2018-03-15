class Ability
  include CanCan::Ability

  def initialize(user)

    can :manage, Commutatus::Income do |income|
      income.user_id == user.id
    end

    can :manage, Commutatus::Expense do |expense|
      expense.user_id == user.id
    end
  end
end
