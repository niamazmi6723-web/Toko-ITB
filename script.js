/* AZMI DIGITAL STORE — demo frontend using browser LocalStorage */
const PRODUCT_KEY = "azmi_store_products_v1";
const ORDER_KEY = "azmi_store_orders_v1";
const CART_KEY = "azmi_store_cart_v1";
const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
const read = (key, fallback=[]) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const defaultProducts = [
 {id:"P001",name:"Minimalist Portfolio Template",category:"Template",price:49000,stock:30,image:"",description:"Template portfolio modern untuk menampilkan karya dan profil profesional."},
 {id:"P002",name:"Social Media Kit",category:"Design",price:35000,stock:25,image:"",description:"Paket desain konten media sosial untuk membantu tampilan brand lebih konsisten."},
 {id:"P003",name:"Productivity Planner",category:"E-Book",price:29000,stock:40,image:"",description:"Planner digital untuk membantu mengatur aktivitas dan target harian."},
 {id:"P004",name:"Premium Icon Bundle",category:"Design",price:59000,stock:15,image:"",description:"Kumpulan ikon digital untuk kebutuhan desain dan presentasi."},
 {id:"P005",name:"Website UI Kit",category:"Template",price:79000,stock:12,image:"",description:"Komponen UI website yang dapat dijadikan titik awal proyek desain."},
 {id:"P006",name:"Digital Business Guide",category:"E-Book",price:39000,stock:50,image:"",description:"Panduan dasar merancang dan mengembangkan ide bisnis digital."}
];
function products(){let p=read(PRODUCT_KEY,null);if(!p){write(PRODUCT_KEY,defaultProducts);return defaultProducts;}return p;}
function orders(){return read(ORDER_KEY,[]);}
function cart(){return read(CART_KEY,[]);}
function setCart(c){write(CART_KEY,c);renderCart();}
function addToCart(id){let p=products().find(x=>x.id===id);if(!p||p.stock<1){alert("Stok produk tidak tersedia.");return;}let c=cart(),item=c.find(x=>x.id===id);if(item){if(item.qty>=p.stock){alert("Jumlah melebihi stok.");return;}item.qty++;}else c.push({id,qty:1});setCart(c);}
function renderProducts(){
 const grid=document.getElementById("productGrid");if(!grid)return;
 const term=(document.getElementById("searchInput").value||"").toLowerCase();
 const active=document.querySelector(".category-btn.active")?.dataset.category||"Semua";
 const list=products().filter(p=>(active==="Semua"||p.category===active)&&(`${p.name} ${p.description} ${p.category}`).toLowerCase().includes(term));
 grid.innerHTML=list.map(p=>`<div class="col-sm-6 col-lg-4"><article class="product-card">
 <div class="product-visual">${p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" onerror="this.remove()">`:`<i class="bi bi-gem"></i>`}<span class="product-tag">${escapeHTML(p.category)}</span></div>
 <div class="product-info"><div class="product-category">${escapeHTML(p.category)}</div><h5>${escapeHTML(p.name)}</h5><p class="product-desc">${escapeHTML(p.description)}</p><div class="d-flex justify-content-between align-items-center"><span class="product-price">${money(p.price)}</span><small class="muted">Stok: ${p.stock}</small></div>
 <div class="product-actions"><button class="btn btn-outline-gold" onclick="showProduct('${p.id}')">Detail</button><button class="btn btn-gold" onclick="addToCart('${p.id}')" ${p.stock<1?"disabled":""}><i class="bi bi-bag-plus"></i> Beli</button></div></div></article></div>`).join("");
 document.getElementById("emptyProducts").classList.toggle("d-none",list.length!==0);
}
function renderCategories(){
 const el=document.getElementById("categoryFilters");if(!el)return;
 const cats=["Semua",...new Set(products().map(p=>p.category))];
 el.innerHTML=cats.map((c,i)=>`<button class="category-btn ${i===0?"active":""}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("");
 el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{el.querySelector(".active")?.classList.remove("active");b.classList.add("active");renderProducts();}));
}
function showProduct(id){
 const p=products().find(x=>x.id===id);if(!p)return;
 document.getElementById("productDetail").innerHTML=`<div class="detail-visual">${p.image?`<img src="${escapeHTML(p.image)}" alt="" style="max-height:100%;max-width:100%">`:`<i class="bi bi-gem"></i>`}</div><span class="product-category">${escapeHTML(p.category)}</span><h3 class="mt-2">${escapeHTML(p.name)}</h3><p class="muted">${escapeHTML(p.description)}</p><h4 class="gold">${money(p.price)}</h4><p class="small muted">Stok tersedia: ${p.stock}</p><button class="btn btn-gold w-100" onclick="addToCart('${p.id}');bootstrap.Modal.getInstance(document.getElementById('productModal')).hide()">Tambah ke Keranjang</button>`;
 bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal")).show();
}
function renderCart(){
 const el=document.getElementById("cartItems");if(!el)return;
 let c=cart(),ps=products(),total=0,count=0;
 el.innerHTML=c.map(item=>{let p=ps.find(x=>x.id===item.id);if(!p)return "";let sub=p.price*item.qty;total+=sub;count+=item.qty;return `<div class="cart-line"><div><strong>${escapeHTML(p.name)}</strong><br><small>${money(p.price)} × ${item.qty}</small></div><div class="text-end"><strong>${money(sub)}</strong><br><button class="btn btn-sm btn-link text-danger p-0" onclick="removeCartItem('${p.id}')">Hapus</button></div></div>`;}).join("")||'<p class="muted text-center py-5">Keranjang masih kosong.</p>';
 document.getElementById("cartCount").textContent=count;document.getElementById("cartTotal").textContent=money(total);
 const totalEl=document.getElementById("checkoutTotal");if(totalEl)totalEl.textContent=money(total);
 document.getElementById("checkoutBtn").disabled=count===0;
}
function removeCartItem(id){setCart(cart().filter(x=>x.id!==id));}
function setupStore(){
 if(!document.getElementById("productGrid"))return;
 document.getElementById("year").textContent=new Date().getFullYear();
 document.getElementById("searchInput").addEventListener("input",renderProducts);
 renderCategories();renderProducts();renderCart();
 document.getElementById("checkoutBtn").addEventListener("click",()=>{
   if(!cart().length)return;
   bootstrap.Offcanvas.getInstance(document.getElementById("cartCanvas"))?.hide();
   document.getElementById("checkoutForm").classList.remove("d-none");document.getElementById("orderSuccess").classList.add("d-none");
   document.getElementById("checkoutForm").reset();renderCart();
   bootstrap.Modal.getOrCreateInstance(document.getElementById("checkoutModal")).show();
 });
 document.getElementById("checkoutForm").addEventListener("submit",e=>{
   e.preventDefault();let c=cart(),ps=products();
   for(const item of c){const p=ps.find(x=>x.id===item.id);if(!p||p.stock<item.qty){alert("Stok "+(p?.name||"produk")+" tidak mencukupi. Silakan periksa keranjang.");return;}}
   const data=Object.fromEntries(new FormData(e.currentTarget).entries());
   const items=c.map(i=>{const p=ps.find(x=>x.id===i.id);p.stock-=i.qty;return {id:p.id,name:p.name,price:p.price,qty:i.qty};});
   const total=items.reduce((s,i)=>s+i.price*i.qty,0);
   const order={number:"AZM-"+Date.now().toString().slice(-8),date:new Date().toISOString(),customer:data.customer,email:data.email,phone:data.phone,note:data.note,items,total,status:"Menunggu"};
   let os=orders();os.unshift(order);write(ORDER_KEY,os);write(PRODUCT_KEY,ps);write(CART_KEY,[]);
   e.currentTarget.classList.add("d-none");document.getElementById("orderSuccess").classList.remove("d-none");document.getElementById("orderNumber").textContent=order.number;renderCart();renderProducts();
 });
}
function setupAdmin(){
 const login=document.getElementById("loginScreen");if(!login)return;
 const app=document.getElementById("adminApp");
 const show=()=>{login.classList.add("d-none");app.classList.remove("d-none");renderAdmin();};
 if(sessionStorage.getItem("azmi_admin_demo")==="yes")show();
 document.getElementById("loginForm").addEventListener("submit",e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.currentTarget).entries());if(d.username==="admin"&&d.password==="azmi123"){sessionStorage.setItem("azmi_admin_demo","yes");document.getElementById("loginError").textContent="";show();}else document.getElementById("loginError").textContent="Username atau password salah.";});
 document.getElementById("logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem("azmi_admin_demo");location.reload();});
 document.getElementById("addProductBtn").addEventListener("click",()=>openProductForm());
 document.getElementById("productForm").addEventListener("submit",saveProduct);
}
function renderAdmin(){
 const ps=products(),os=orders();
 document.getElementById("statProducts").textContent=ps.length;document.getElementById("statOrders").textContent=os.length;
 document.getElementById("statPending").textContent=os.filter(o=>o.status==="Menunggu").length;document.getElementById("statDone").textContent=os.filter(o=>o.status==="Selesai").length;
 document.getElementById("adminProducts").innerHTML=ps.map(p=>`<tr><td><strong>${escapeHTML(p.name)}</strong><br><small class="muted">${escapeHTML(p.id)}</small></td><td>${escapeHTML(p.category)}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><button class="btn btn-outline-gold me-1" onclick="editProduct('${p.id}')">Edit</button><button class="btn btn-outline-danger" onclick="deleteProduct('${p.id}')">Hapus</button></td></tr>`).join("")||'<tr><td colspan="5">Belum ada produk.</td></tr>';
 document.getElementById("adminOrders").innerHTML=os.map(o=>`<tr><td><strong>${escapeHTML(o.number)}</strong><br><small class="muted">${o.items.length} item</small></td><td>${escapeHTML(o.customer)}<br><small class="muted">${escapeHTML(o.phone)}</small></td><td>${new Date(o.date).toLocaleDateString("id-ID")}</td><td>${money(o.total)}</td><td><select class="status-select" onchange="updateOrderStatus('${o.number}',this.value)">${["Menunggu","Diproses","Selesai","Dibatalkan"].map(s=>`<option ${o.status===s?"selected":""}>${s}</option>`).join("")}</select></td><td><button class="btn btn-outline-gold" onclick="viewOrder('${o.number}')">Detail</button></td></tr>`).join("")||'<tr><td colspan="6">Belum ada pesanan.</td></tr>';
}
function openProductForm(p=null){
 const f=document.getElementById("productForm");f.reset();f.elements.id.value=p?.id||"";
 f.elements.name.value=p?.name||"";f.elements.category.value=p?.category||"";f.elements.price.value=p?.price??"";f.elements.stock.value=p?.stock??"";f.elements.image.value=p?.image||"";f.elements.description.value=p?.description||"";
 document.getElementById("productFormTitle").textContent=p?"Edit Produk":"Tambah Produk";
 bootstrap.Modal.getOrCreateInstance(document.getElementById("editProductModal")).show();
}
function editProduct(id){let p=products().find(x=>x.id===id);if(p)openProductForm(p);}
function saveProduct(e){
 e.preventDefault();let d=Object.fromEntries(new FormData(e.currentTarget).entries()),ps=products();
 let p={id:d.id||"P"+Date.now(),name:d.name.trim(),category:d.category.trim(),price:Number(d.price),stock:Number(d.stock),image:d.image.trim(),description:d.description.trim()};
 if(d.id){ps=ps.map(x=>x.id===d.id?p:x);}else ps.push(p);
 write(PRODUCT_KEY,ps);bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();renderAdmin();
}
function deleteProduct(id){if(!confirm("Hapus produk ini?"))return;write(PRODUCT_KEY,products().filter(p=>p.id!==id));renderAdmin();}
function updateOrderStatus(number,status){let os=orders().map(o=>o.number===number?{...o,status}:o);write(ORDER_KEY,os);renderAdmin();}
function viewOrder(number){let o=orders().find(x=>x.number===number);if(!o)return;alert(`Pesanan: ${o.number}\nNama: ${o.customer}\nEmail: ${o.email}\nWhatsApp: ${o.phone}\n\n${o.items.map(i=>`${i.name} x${i.qty} — ${money(i.price*i.qty)}`).join("\n")}\n\nTotal: ${money(o.total)}\nStatus: ${o.status}\nCatatan: ${o.note||"-"}`);}
document.addEventListener("DOMContentLoaded",()=>{setupStore();setupAdmin();});
