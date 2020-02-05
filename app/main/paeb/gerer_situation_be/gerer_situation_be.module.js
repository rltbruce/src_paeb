(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_be', [
            'app.paeb.gerer_situation_be.passation_marches_be',
            'app.paeb.gerer_situation_be.contrat_be'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_be', {
            title : 'Gerer situation be',
            icon  : 'icon-data',
            weight: 3
        });



    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
