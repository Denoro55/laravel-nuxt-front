<template>
	<div class="another-user">
		<div class="section mb-7">
			<div class="another-user__main d-flex align-center">
				<div class="another-user__logo"
				     :style="getUserImage(another_user.image_url)"
				></div>
				<div class="another-user__info ml-5">
					<div class="another-user__name mb-2">{{another_user.name}}</div>
					<div class="another-user__params mb-4 d-flex">
						<div class="another-user__param d-flex align-center">
							<v-icon class="ml-0" color="red" light right>mdi-cards-heart</v-icon>
							<div class="another-user__param-value ml-2">{{another_user.avatarLikes}}</div>
						</div>
						<div class="another-user__param d-flex align-center ml-5">
							<v-icon class="ml-0" color="white" light right>mdi-account-multiple</v-icon>
							<div class="another-user__param-value ml-2">{{another_user.userFriends}}</div>
						</div>
					</div>
					<v-btn :to="`/messages?user=${another_user.id}`" class="primary">
						Message
						<v-icon class="ml-3" dark right>mdi-email</v-icon>
					</v-btn>
					<template v-if="!another_user.isFriend">
						<v-btn @click="addFriend" class="success ml-3">Add friend
							<v-icon class="ml-1" medium dark right>mdi-account</v-icon>
						</v-btn>
					</template>
					<template v-else-if="another_user.isFriend === 1">
						<v-btn @click="removeFriend" class="ml-3">Add friend
							<v-icon class="ml-1" medium dark right>mdi-account</v-icon>
						</v-btn>
					</template>
					<template v-else>
						<v-btn @click="removeFriend" class="error ml-3">Remove friend
							<v-icon class="ml-1" medium dark right>mdi-account</v-icon>
						</v-btn>
					</template>
					<v-btn :class="{error: !another_user.liked }" @click="likeAvatar" class="ml-3">Like
						<v-icon light right>mdi-cards-heart</v-icon>
					</v-btn>
				</div>
			</div>
		</div>
		<div class="section">
			<v-expansion-panels :readonly="false" multiple>
				<v-expansion-panel v-for="article in articles" :key="article.id">
					<v-expansion-panel-header>{{article.title}}</v-expansion-panel-header>
					<v-expansion-panel-content>
						<div class="articles__content mb-2">
							<div class="articles__body mb-5">
								{{ article.content }}
							</div>
							<div class="articles__controls mb-1 d-flex align-center">
								<div class="icon-text d-flex align-center">
									<v-icon>mdi-comment</v-icon>
									<div class="icon-text__value ml-2">
										{{ article.commentsCount }}
									</div>
								</div>
								<div class="icon-text d-flex align-center ml-4">
									<v-icon color="red">mdi-cards-heart</v-icon>
									<div class="icon-text__value ml-2">
										{{ article.likes }}
									</div>
								</div>
								<v-btn @click="showComment(article)" class="primary ml-4">
									Comments
								</v-btn>
								<v-btn @click="likeArticle(article)" class="ml-4" :class="{error: !article.liked }">
									<v-icon color="white">mdi-cards-heart</v-icon>
								</v-btn>
								<div class="articles_created ml-auto">
									{{ article.updated_at }}
								</div>

							</div>
						</div>
						<div v-show="article.showComment" class="article__comments mb-2 mt-6">
							<div class="article__new-comment mb-4">
								<v-form :ref="`commentForm-${article.id}`" @submit.prevent="sendComment(article, $event)">
									<div class="new-comment d-flex align-center">
										<div class="new-comment__input mr-5">
											<v-text-field
													v-model="message"
													:rules="messageRules"
													label="Write a message"
													required
											></v-text-field>
										</div>
										<div class="new-comment__send">
											<v-btn type="submit" class="success">Send</v-btn>
										</div>
									</div>
								</v-form>
							</div>
							<div v-for="comment in article.comments" class="article-comment white black--text elevation-5 mb-5 pa-4 d-flex">
								<div class="article-comment__logo mr-4" :style="{backgroundImage: `url(/img/${comment.userImage})`}"></div>
								<div class="article-comment__content">
									<div class="article-comment__head">
										<div class="article-comment__name mb-1">{{ comment.name }}</div>
										<div class="article-comment__date">{{ comment.created_at }}</div>
									</div>
									<div class="article-comment__text mb-1">{{ comment.text }}</div>
								</div>
							</div>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</div>
</template>

<script>
	export default {
		middleware: ['userPage', 'auth'],
		async asyncData ({ $axios, store, params }) {
			// this.$store.state.auth.user.id
			const options = {
				user_id: params.id,
				watcher_id: store.state.auth.user.id
			};
			// console.log(options);
			const user = await $axios.post('user', options);
			let articles = user.data.articles;
			articles.forEach(function(e){
				e.showComment = false;
				e.commentsLoaded = false;
				e.comments = []
			});
			// console.log(user);
			return {
				articles: articles,
				another_user: user.data.user[0],
			}
		},
		data() {
			return {
				message: '',
				messageRules: [
					v => !!v || 'Text is required'
				]
			}
		},
		methods: {
			async showComment(article) {
				if (!article.commentsLoaded) {
					const form = { article_id: article.id };
					const response = await this.$axios.$post('articles/comments', form);
					// console.log(response);
					article.commentsLoaded = true;
					article.comments = response;
				}
				// console.log(article);
				article.showComment = !article.showComment;
			},
			async sendComment(article, event) {
				const ref = 'commentForm-' + article.id;
				const thisForm = this.$refs[ref][0];
				thisForm.reset();
				const form = {
					article_id: article.id,
					user_id: this.$store.state.auth.user.id,
					name: this.$store.state.auth.user.name,
					text: event.target[0].value,
					created_at: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
				};
				const response = await this.$axios.$post('articles/comment', form);
				article.commentsCount++;
				if (response.success === true) {
					article.comments.unshift(Object.assign(form, {userImage: this.$store.state.auth.user.image_url}));
				}
			},
			async likeArticle(article) {
				let type = 'add';
				if (this.isPostLiked(article.liked)) {
					article.likes--;
					article.liked = null;
					type = 'remove';
				} else {
					article.likes++;
					article.liked = this.$store.state.auth.user.id;
				}
				const form = {
					article_id: article.id,
					user_id: this.$store.state.auth.user.id,
					type: type
				};
				// console.log(article);
				await this.$axios.$post('articles/like', form);
			},
			likeAvatar() {
				let type = 'like';
				if (this.another_user.liked) {
					this.another_user.liked = null;
					this.another_user.avatarLikes--;
					type = 'dislike';
				} else {
					this.another_user.liked = 1;
					this.another_user.avatarLikes++;
				}
				const form = {
					liker_id: this.$store.state.auth.user.id,
					user_id: this.another_user.id,
					type: type
				};
				this.$axios.$post('user/likeAvatar', form);
			},
			addFriend() {
				const form = {
					user_id: this.$store.state.auth.user.id,
					friend_id: this.another_user.id
				};
				this.another_user.isFriend = 1;
				this.$axios.$post('user/addFriend', form);
			},
			removeFriend() {
				const form = {
					user_id: this.$store.state.auth.user.id,
					friend_id: this.another_user.id
				};
				this.another_user.isFriend = null;
				this.$axios.$post('user/removeFriend', form);
			},
			isPostLiked(id) {
				return id !== 0;
			},
			getUserImage(url) {
				if (url) {
					return {
						backgroundImage: `url(/img/${url})`
					}
				} else {
					return {
						backgroundImage: `url(/default_user_avatar.png)`
					}
				}
			}
		},
		mounted() {
			// console.log(this.$route.params.id);
		}
	}
</script>

<style lang="scss">
	.another-user {
		padding-top: 20px;

		&__logo {
			width: 150px;
			height: 150px;
			border-radius: 50%;
			background-size: cover;
			background-position: center center;
		}

		&__name {
			font-size: 22px;
		}
	}

	.new-comment {
		&__input {
			flex: 1;
		}
	}


</style>