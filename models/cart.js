module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {} ;
    this.totalQty = oldCart.totalQty || 0 ;
    this.totalPrice = oldCart.totalPrice || 0 ;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, trackPrice: 0}
        }

        storedItem.qty++;
        storedItem.trackPrice = storedItem.item.trackPrice * storedItem.qty;
        this.totalQty++;
        this.totalPrice = Number(this.totalPrice) + Number(storedItem.item.trackPrice) ;
        
        console.log('$$$$ >>> ');
        console.log(this.totalPrice);
        console.log('$$$$ >>> ');
    };

    this.generateArray = function(){
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};