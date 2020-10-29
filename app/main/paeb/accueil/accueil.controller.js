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
         vm.showracourci_aac = false;
        var id_user = $cookieStore.get('id');
       
        if (id_user > 0) 
        {

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
            {
                  var utilisateur = result.data.response;
                  console.log(utilisateur);
                  if (utilisateur.roles.indexOf("ADMIN")!= -1)
                  {
                    vm.showracourci_obcaf = true;
                    vm.showracourci_bcaf  = true;
                    vm.showracourci_aac = true; 
                  }

                  if (utilisateur.roles.indexOf("AAC")!= -1)
                  {
                    vm.showracourci_aac = true; 
                  }

                  if (utilisateur.roles.indexOf("OBCAF")!= -1)
                  {
                    vm.showracourci_obcaf = true;
                  }
                  
                  if (utilisateur.roles.indexOf("BCAF")!= -1)
                  {
                    vm.showracourci_obcaf = true; 
                  }                

             });
        }
    }
})();
