(function ()
{
    'use strict';

    angular
        .module('app.paeb.accueil')
        .controller('AccueilController', AccueilController);

    /** @ngInject */
    function AccueilController($cookieStore,apiFactory)
    {
        var vm = this;        
          vm.showracourci_obcaf = false;
         vm.showracourci_bcaf  = false;
         vm.showracourci_acc = false;
        var id_user = $cookieStore.get('id');
       
        if (id_user > 0) 
        {

             apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
            {
                  vm.roles = result.data.response.roles;
                  switch (vm.roles[0])
                    {
                      case 'ACC': 
                            {
                              vm.showracourci_acc = true;
                              break;
                            }

                        case 'OBCAF': 
                              {
                                vm.showracourci_obcaf  = true;
                                break;
                              }

                        case 'BCAF': 
                              {                                
                                vm.showracourci_bcaf  = true;
                                break;
                              }

                      case 'ADMIN':
                              {
                                vm.showracourci_obcaf = true;
                                vm.showracourci_bcaf  = true;
                                vm.showracourci_acc = true; 
                                break;
                              } 

                      default:
                          break;
                  
                    }                  

             });
        }
    }
})();
