---
title: 数据结构实践期末复习
published: 2026-07-04
description: "数据结构课程全部编程题完整代码，按题号顺序整理"
image: ""
tags: [数据结构, 期末复习, C++, 算法, 大学课程]
category: 日常学习
draft: false
lang: zh
comment: true
---

本文按题号顺序整理数据结构课程全部编程题的完整代码。

## 1A找朋友

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;


ll euler_phi(ll n){
	ll ans = n;
	for(ll i = 2; i <= n; i++){
		if(n % i == 0){
			ans = ans / i * (i - 1);
			while(n % i == 0){
				n /= i;
			}
		}
	}
	if(n > 1){
		ans = ans / n * (n - 1);
	}
	return ans;
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	ll n;
	while(cin >> n && n != 0){
		cout << euler_phi(n) << "\n";
	}
}
```

## 1B互质

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

ll euler_phi(ll n){
	ll ans = n;
	for(ll i = 2; i * i <= n; i++){
		if(n % i == 0){
			ans = ans / i * (i - 1);
			while(n % i == 0){
				n /= i;
			}
		}
	}
	if(n > 1){
		ans = ans / n * (n - 1);
	}
	return ans;
}


int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	ll n;
	while(cin >> n && n != 0){
		cout << euler_phi(n) << "\n";
	}
}
```

## 1C约瑟夫问题

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;




int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n, m;
	cin >> n >> m;
	queue<int>q;
	for(int i = 1;  i <= n; i++)q.push(i);
	while(!q.empty()){
		for(int i = 1 ; i < m ;i++){
			q.push(q.front());
			q.pop();
		}
		cout << q.front() << " ";
		q.pop();
	}
}
```

## 1D进制转换

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
typedef long long ll;
//判一下是不是负数
string turn(ll n, int r){
	if(n == 0)return "0";
	string res = "";
	bool fu = false;
	if(n < 0){
		fu = true;
		n = -n;
	}
	while(n > 0){
		int remain = n % r;
		char digit;
		if(remain < 10){
			digit = remain + '0';
		}else digit = remain - 10 + 'A';
		res = digit + res;
		n /= r;
	}
	if(fu){
		res = '-' + res;
	}
	return res;
}



int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	ll n;
	int r;
	while(cin >> n >> r){
		string ans = turn(n, r);
		cout << ans << "\n";
	}
	
}
```

## 1E整数求和式

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;




int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int a, b;
	char op1, op2;
	cin >> a >> op1 >> b >> op2;
	int ans  = a + b;
	cout << a << op1 << b  << op2  << ans;
}
```

## 1F波兰表达式

```cpp
#include<bits/stdc++.h>
using namespace std;

double polan(){
	string s;
	cin >> s;
	if(s == "+") return polan() + polan();
	if(s == "/") return polan() / polan();
	if(s == "*" ) return polan() * polan();
    if(s == "-") return polan() - polan();
	return stod(s);
	
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	cout << fixed << setprecision(6) << polan() << "\n";
}
```

## 1G合并队列

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	vector<int>b(n);
    vector<int>a(n);
	for(int i =0 ;i < n; i++)cin >> a[i];
	for(int i = 0;i < n; i++)cin >> b[i];
	int i = 0,  j = 0;
	vector<int>c;
	while(i < n && j < n){
		if(a[i] <= b[j]){
			c.push_back(a[i]);
			i++;
		}else{
			c.push_back(b[j]);
			j++;
		}
	}
	while(i < n){
		c.push_back(a[i]);
		i++;
	}
	while(j < n){
		c.push_back(b[j]);
		j++;
	}
	for(int num : c)cout << num << " ";
}
```

## 2A子串个数

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	string s;
	cin >> s;
	int n = s.size();
	cout << (n + 1) * n / 2 + 1;
}
```

## 2B模式串

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	string s;
	string tar;
	cin >> s >> tar;
	auto it = s.find(tar);
	if(it == string::npos){
		cout << 0;
	}else{
		cout << it + 1;
	}
}
```

## 2C主对角线上的数据和

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
    int n;
	cin >> n;
	int ans = 0;
	for(int i = 1; i <= n; i++){
		for(int j = 1; j <= n; j++){
			int num;
			cin >> num;
			if(i == j) ans+=num;
		}
	}
	cout << ans;
}
```

## 2D顺时针排螺旋阵

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	vector<vector<int>>m(n, vector<int>(n));
	int cnt = 1;
	int up = 0, down = n - 1, l = 0, r = n - 1;
	while(cnt <= n * n){
		for(int i = l ; i <= r; i++)m[up][i] = cnt++; up++;
		for(int i = up; i <= down; i++)m[i][r] = cnt++; r--;
		for(int i = r ; i >= l; i--)m[down][i] = cnt++; down--;
		for(int i = down; i >= up; i--)m[i][l] = cnt++; l++;
	}
	for(int i = 0; i< n; i++){
		for(int j = 0;  j< n; j++){
			cout << m[i][j] << " ";
		}
		cout << "\n";
	}
}
```

## 2E汉诺塔的移动

```cpp
#include<bits/stdc++.h>
using namespace std;

int step = 1;
void hanno(int n, char a, char c, char b){
	if(n == 1){
		cout << step++ << " " << n << " " << a << "->" << c << endl;
		return;
	}
	hanno(n - 1, a, b, c);
	cout << step++ << " " << n << " " << a << "->" << c << "\n";
	hanno(n - 1, b, c , a);
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
    int n;
	cin >> n;
	hanno(n, 'A', 'C', 'B');
}
```

## 2F树的先根遍历

```cpp
#include<bits/stdc++.h>
using namespace std;


vector<int>g[200];
void dfs(int st){
	cout << char(st + 'A')<< " ";
	for(auto v : g[st]){
		dfs(v);
	}
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	char a, b;
	int inv[26] = {0};
	int chuxian[26] = {0};
	while(cin >> a >> b){
		g[a - 'A'].push_back(b - 'A');
		inv[b - 'A']++;
		chuxian[b - 'A']++, chuxian[a - 'A']++;
	}
	int st;
	for(int i = 0 ; i < 26; i++){
		if(inv[i] == 0 && chuxian[i] > 0){
			st = i;
			break;
		}
	}
	dfs(st);
	return 0;
}
```

## 2G树的后根遍历

```cpp
#include<bits/stdc++.h>
using namespace std;


vector<int>g[200];
void dfs(int st){
	for(auto v : g[st]){
		dfs(v);
	}
	cout << char(st + 'A')<< " ";
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	char a, b;
	int inv[26] = {0};
	int chuxian[26] = {0};
	while(cin >> a >> b){
		g[a - 'A'].push_back(b - 'A');
		inv[b - 'A']++;
		chuxian[b - 'A']++, chuxian[a - 'A']++;
	}
	int st;
	for(int i = 0 ; i < 26; i++){
		if(inv[i] == 0 && chuxian[i] > 0){
			st = i;
			break;
		}
	}
	dfs(st);
	return 0;
}
```

## 3A二叉链存储的二叉树

```cpp
#include<bits/stdc++.h>
using namespace std;

struct Node {
	char val;
	Node* left;
	Node* right;
	Node(char v) : val(v), left(nullptr), right(nullptr) {}
};

int idx = 0;
string s;

// 根据带空格的先序序列建树
Node* buildTree() {
	// 越界保护
	if (idx >= s.length()) return nullptr;
	
	char c = s[idx++];
	
	// 核心特判：遇到空格代表空节点，直接返回
	if (c == ' ') return nullptr; 
	
	Node* root = new Node(c);
	root->left = buildTree();
	root->right = buildTree();
	return root;
}

// 先序遍历
void preOrder(Node* root) {
	if (!root) return;
	cout << root->val << " ";
	preOrder(root->left);
	preOrder(root->right);
}

// 中序遍历
void inOrder(Node* root) {
	if (!root) return;
	inOrder(root->left);
	cout << root->val << " ";
	inOrder(root->right);
}

int main() {
	ios::sync_with_stdio(false);
	cin.tie(0);
	
	// 必须用 getline 读取整行，才能把空格全都读进来
	if (getline(cin, s)) {
		idx = 0;
		Node* root = buildTree();
		
		preOrder(root);
		cout << "\n";
		
		inOrder(root);
		cout << "\n";
		
		// 顺从题目bug，输出第二次中序
		inOrder(root);
		cout << "\n";
	}
	return 0;
}
```

## 3B哈夫曼树

```cpp
#include<bits/stdc++.h>
using namespace std;



int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
    int n;
	while(cin >> n){
	priority_queue<int, vector<int>, greater<int>>q;
	for(int i = 0;i < n ;i++){
		int num;
		cin >> num;
		q.push(num);
	}
	int ans = 0;
	while(q.size() > 1){
		int t1 = q.top(); q.pop();
		int t2 = q.top(); q.pop();
		ans += t1 + t2;
		int t3 = t1 + t2;
		q.push(t3);
	}
	cout << ans << "\n";
	}
}
```

## 3C树的遍历

```cpp
#include<bits/stdc++.h>
using namespace std;

int pre[50];
int last[50];
int pos1[50];
int pos2[50];
int L[50];
int R[50];
bool notonly = false;

void dfs(int l , int r){
	if(l >= r)return;
	int root = pre[l];
	int lroot = pre[l + 1];
	int rroot = last[pos2[root] - 1];
	if(lroot == rroot){
		notonly = true;
		R[root] = rroot;
		dfs(l + 1, r);
		return;
	}
	int lsize = pos1[rroot] - pos1[lroot];
	L[root] = lroot;
	R[root] = rroot;
	dfs(l + 1, l + lsize);
	dfs(l + lsize + 1, r);
}

void inorder(int r){
	if(L[r])inorder(L[r]);
	cout << r << " ";
	if(R[r])inorder(R[r]);
	if(r == pre[1]){
		cout << "\n";
	}
}
int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	for(int i =1 ;i <= n; i++){
		cin >> pre[i];
		pos1[pre[i]] = i;
	}
	for(int i = 1;i <= n; i++){
		cin >> last[i];
		pos2[last[i]] = i;
	}
	dfs(1, n);
	if(notonly)cout << "No" << "\n";
	else cout << "Yes\n";
	inorder(pre[1]);
	
}
```

## 3D最短路径

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF = 0x3f3f3f3f;
int n;
vector<pair<int, int>>g[200];
bool vis[200];
int dist[200];

void dijkstra(int st){
	for(int i = 1; i <= n; i++){
		dist[i]  = INF;
		vis[i] = false;
	}
	dist[st] = 0;
	priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>pq;
	pq.push({0, st});
	while(!pq.empty()){
		auto[D, u] = pq.top(); pq.pop();
		if(vis[u])continue;
		vis[u] = true;
		for(auto[v, w] : g[u]){
			if(dist[v] > dist[u] + w){
				dist[v] = dist[u] + w;
				pq.push({dist[v], v});
			}
		}
	}
}


int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
    int m;
	cin >> n >> m;
	for(int i =0 ;i < m; i++){
		int u, v , w;
		cin >> u >> v >> w;
		g[u].push_back({v, w});
	}
	int st, ed;
	cin >> st >> ed;
	dijkstra(st);
	if(dist[ed] == INF) cout << "STOP\n";
	else cout << dist[ed];
}
```

## 3E最小生成树

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF = 0x3f3f3f3f;
vector<pair<int, int>>g[200];
bool vis[200];
int dist[200];
typedef long long ll;
int prim(int n){
	for(int i = 1; i <= n; i++){
		dist[i]  = INF;
		vis[i] = false;
	}
	dist[1] = 0;
	priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>pq;
	pq.push({0, 1});
	int ans = 0;
	int cnt = 0;
	while(!pq.empty()){
		auto[D, u] = pq.top(); pq.pop();
		if(vis[u])continue;
		vis[u] = true;
		ans += D;
		cnt++;
		for(auto[v, w] : g[u]){
			if(!vis[v] && dist[v] > w){
				dist[v] = w;
				pq.push({dist[v], v});
			}
		}
	}
	if(cnt != n)return -1;
	return ans;
}


int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	for(int i = 1; i <= n; i++){
		for(int j = 1; j <= n; j++){
			int num;
			cin >> num;
			if(num != 0){
				g[i].push_back({j, num});
			}
		}
	}
	ll ans = prim(n);
	cout << ans;
	
}
```

## 4A机器人王国里的最短路径

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
typedef long long ll;

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	int edges = (1 << (n + 1)) - 2;
	unordered_map<string, pair<string, int>>pmap;
	for(int i =0; i< edges; i++){
		string u, v;
		int w;
		cin >> u >> v >> w;
		pmap[v] = {u, w};
	}
	string t;
	cin >> t;
	ll ans = 0;
	string cur = t;
	while(pmap.count(cur)){
		ans += pmap[cur].second;
		cur = pmap[cur].first;
	}
	cout << ans << "\n";
	return 0;
}
```

## 4B从原点开始的最短路径

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF = 0x3f3f3f3f;
int n;
vector<pair<int, int>>g[200];
bool vis[200];
int dist[200];

void dijkstra(int st){
	for(int i = 1; i <= n; i++){
		dist[i]  = INF;
		vis[i] = false;
	}
	dist[st] = 0;
	priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>pq;
	pq.push({0, st});
	while(!pq.empty()){
		auto[D, u] = pq.top(); pq.pop();
		if(vis[u])continue;
		vis[u] = true;
		for(auto[v, w] : g[u]){
			if(dist[v] > dist[u] + w){
				dist[v] = dist[u] + w;
				pq.push({dist[v], v});
			}
		}
	}
}


int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int m;
	cin >> n >> m;
	for(int i =0 ;i < m; i++){
		int u, v , w;
		cin >> u >> v >> w;
		g[u].push_back({v, w});
	}
	dijkstra(1);
	int t;
	cin >> t;
	cout << dist[t];
}
```

## 4C最少天数

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF = 0x3f3f3f3f;

map<char, vector<pair<char, int>>>g;
map<char, int>memo;

int dfs(char ch){
	if(ch == 'Z')return 0;
	if(memo.count(ch))return memo[ch];
	int mx = -1e9;
	for(auto u : g[ch]){
		int v = u.first;
		int w = u.second;
		mx = max(mx, dfs(v) + w);
	}
	return memo[ch] = mx;
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n, m;
	cin >> n >> m;
	for(int i = 0; i< m ; i++){
		char u, v;
		int w;
		cin >> u >> v >>w;
		g[u].push_back({v, w});
	}
	cout << dfs('A');
}
```

## 4D求第二小的天数

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF = 0x3f3f3f3f;


int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int t;
	cin >> t;
	while(t--){
		int n;
		cin >> n;
		set<int>q;
		for(int i = 1; i <= n; i++){
			int num;
			cin >> num;
			q.insert(num);
		}
		if(q.size() <= 1){
			cout << "NO\n";
		}
		vector<int>ans(q.begin(), q.end());
		cout << ans[1] << "\n";
	}
}
```

## 4E按十进制排序

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF = 0x3f3f3f3f;


bool cmp(int a, int b){
	int t1 = a,  t2 = b;
	int a1 = 0, b1 = 0;
	while(t1){
		a1 += t1 % 10;
		t1 /=10;
	}
	while(t2){
		b1 += t2 % 10;
		t2 /=10;
	}
	if(a1 != b1)return a1 > b1;
	return a > b;
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	vector<int>a(n);
	for(int i =0 ;i < n; i++){
		cin >> a[i];
	}
	sort(a.begin(), a.end(), cmp);
	for(int num : a)cout << num << " ";
	
}
```

## 4F奇偶数的排序

```cpp
#include<bits/stdc++.h>
using namespace std;
using ll = long long;
const int mod = 1e9 + 7;
const int N = 1e5 + 5;
const int INF = 0x3f3f3f3f;



void solve(){
	vector<int>odd;
	vector<int>even;
	int num;
	for(int i = 0;i < 10; i++){
		cin >> num;
		if(num % 2 != 0)odd.push_back(num);
		else even.push_back(num);
	}
	sort(odd.begin(), odd.end(), greater());
	sort(even.begin(), even.end());
	for(int i = 0;i < 5; i++)cout << odd[i] << " ";
	for(int i = 0; i < 5; i++)cout << even[i] << " ";
}

int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int t = 1;
	//cin >> t;
	
	while(t--){
		solve();
	}
	return  0;
	
	
}
```

## 4G哈夫曼建树

```cpp
#include<bits/stdc++.h>
using namespace std;

struct node{
	char ch;
	int freq;
	node* left;
	node*right;
	
	node(char ch, int freq){
		this->ch = ch;
		this->freq = freq; 
		left = nullptr;
		right = nullptr;
	}
	node(int freq, node*l ,node* r){
		ch = '\0';
		this->freq = freq;
		left = l;
		right = r;
	}
};

struct compare{
	bool operator() (node* a, node* b){
		return a->freq > b->freq;
	}
};

void generatecode(node*root, string code, map<char, string>& huffman){
	if(!root)return ;
	if(!root->left && !root->right) huffman[root->ch] = code;
	
	generatecode(root->left, code + "0", huffman);
	generatecode(root->right, code + "1", huffman);
}


int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int n;
	cin >> n;
	char ch[26];
	int pre[200];
	
	priority_queue<node*, vector<node*>, compare>pq;
	for(int i= 0 ; i < n; i++){
		cin >> ch[i] >> pre[i];
		pq.push(new node(ch[i], pre[i]));
	}
	if(n == 1){
		cout << ch[0] << ": 0" << "\n";
		return 0;
	}
	while(pq.size() > 1){
		node* l = pq.top();
		pq.pop();
		node* r = pq.top();
		pq.pop();
		node* parent = new node(l->freq + r->freq, l, r);
		pq.push(parent);
	}
	node* root = pq.top();
	map<char, string>huffman;
	generatecode(root, "", huffman);
	for(int i =0 ; i< n; i++){
		cout << ch[i] << ": " << huffman[ch[i]] << "\n";
	}
	return 0;
	
}
```
