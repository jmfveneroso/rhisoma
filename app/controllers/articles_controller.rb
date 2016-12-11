class ArticlesController < ApplicationController
  def new
  end

  def create
    @article = Article.new(params[:article].permit(:title, :text))
    # @article.id = 10
   
    @article.save
    redirect_to @article

    # render plain: params[:article].inspect
  end

  def show
    @article = Article.find(params[:id])
  end
end
