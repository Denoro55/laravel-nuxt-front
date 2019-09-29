<template>
	<v-app dark>
		<v-navigation-drawer
				v-model="drawer"
				:mini-variant="miniVariant"
				:clipped="clipped"
				fixed
				app
		>
			<div class="chat-sidebar">
				<div class="chat-sidebar__exit mb-5">
					<v-btn @click="leaveChat" class="error">Leave chat</v-btn>
				</div>
				<div class="chat-users">
					<div class="chat-users__top">
						Online users:
					</div>
				</div>
				<v-list>
					<v-list-item class="chat-user"
							v-for="(item, i) in users"
							:key="i"
							:to="item.to"
							router
							exact
					>
						<v-list-item-action class="mr-4">
							<div class="chat-user__image" :style="getUserImage(item.image_url)">
							</div>
							<!--<v-icon :color="chatUser.id === item.id ? 'green' : 'red'">mdi-account-circle</v-icon>-->
						</v-list-item-action>
						<v-list-item-content>
							<v-btn text v-bind="{ to: item.real_id ? `/user/${item.real_id}` : null }" v-text="item.name"></v-btn>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</div>
		</v-navigation-drawer>
		<v-app-bar class="px-3 pl-4"
				:clipped-left="clipped"
				fixed
				app
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
			<v-btn
					icon
					@click.stop="miniVariant = !miniVariant"
			>
				<v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
			</v-btn>
			<v-btn
					icon
					@click.stop="clipped = !clipped"
			>
				<v-icon>mdi-application</v-icon>
			</v-btn>

			<v-toolbar-title class="px-3" v-text="user.name"/>
			<!--<v-btn class="ml-4" to="/dashboard">Dashboard</v-btn>-->
			<!--<v-btn class="ml-4 info" to="/vuex">Vuex</v-btn>-->
			<!--<v-btn class="ml-4 info" to="/user/2">User 2</v-btn>-->
			<!--<v-btn class="ml-4 info" to="/user/3">User 3</v-btn>-->
			<v-spacer/>
			<template v-if="authenticated">
				<v-btn class="error ml-3" @click.prevent="logout">Logout</v-btn>
			</template>
			<template v-else>
				<v-btn class="primary" to="/login">Login</v-btn>
				<v-btn class="success ml-4" to="/register">Register</v-btn>
			</template>
		</v-app-bar>
		<v-content>
			<v-container style="height: 100%;" class="pl-7 pr-7 pb-7">
				<nuxt/>
			</v-container>
		</v-content>
		<v-footer
				:fixed="fixed"
				app
		>
			<span>&copy; 2019</span>
		</v-footer>
	</v-app>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				clipped: false,
				drawer: true,
				fixed: false,
				miniVariant: false,
				right: true,
				rightDrawer: false
			}
		},
		computed: mapState(['chatUser', 'users']),
		methods: {
			...mapMutations(['clearData']),
			logout() {
				this.$auth.logout();
			},
			leaveChat() {
				this.$socket.emit('userLeft', this.chatUser.id , () => {
					this.$router.push('/?message=userLeft');
					this.clearData();
				});
			},
			getUserImage(url) {
				if (url) {
					return {
						backgroundImage: `url(/img/${url})`
					}
				} else {
					return {
						backgroundImage: `url(default_user_avatar.png)`
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.chat-user {
		&__image {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;
			background-size: cover;
			background-position: center center;
		}
	}

	.avatar {
		padding: 30px 20px 10px;

		&__image {
			width: 120px;
			height: 120px;
			border-radius: 50%;
			background-size: cover;
			background-position: center center;
			margin: 0 auto 10px auto;
		}

		&__name {
			text-align: center;
			color: #FFF;
			font-size: 20px;
		}
	}
	.chat-sidebar {
		padding: 25px 17px 0 25px;

		.v-list-item {
			padding-left: 0;
		}

		.v-list-item__action {
			margin: 8px 0;
		}
		
		.v-list-item__content .v-btn {
			text-transform: none;
			justify-content: flex-start;
		}
	}
</style>