-- Dados demonstrativos da Conecta.
-- Execute após criar no Supabase Auth contas com estes e-mails:
-- cliente.demo@conecta.local
-- profissional.pc@conecta.local
-- profissional.redes@conecta.local
-- profissional.hardware@conecta.local

DO $$
DECLARE
    cliente_id UUID;
    pc_id UUID;
    redes_id UUID;
    hardware_id UUID;
    request_id UUID;
BEGIN
    SELECT id INTO cliente_id
    FROM auth.users
    WHERE email = 'cliente.demo@conecta.local';

    SELECT id INTO pc_id
    FROM auth.users
    WHERE email = 'profissional.pc@conecta.local';

    SELECT id INTO redes_id
    FROM auth.users
    WHERE email = 'profissional.redes@conecta.local';

    SELECT id INTO hardware_id
    FROM auth.users
    WHERE email = 'profissional.hardware@conecta.local';

    IF pc_id IS NOT NULL THEN
        UPDATE public.profiles
        SET
            role = 'professional',
            full_name = 'Conecta Demo - Informática',
            presentation = 'Manutenção de computadores e notebooks',
            description = 'Atendimento demonstrativo para diagnóstico, limpeza, formatação, recuperação de sistemas e substituição de componentes.',
            specialties = ARRAY['Manutenção', 'Formatação', 'Notebook'],
            service_categories = ARRAY['Computadores', 'Hardware', 'Recuperação'],
            service_area = 'Centro e região próxima',
            city = 'Cidade de demonstração',
            is_available = TRUE,
            is_demo = TRUE
        WHERE id = pc_id;
    END IF;

    IF redes_id IS NOT NULL THEN
        UPDATE public.profiles
        SET
            role = 'professional',
            full_name = 'Conecta Demo - Redes',
            presentation = 'Redes, Wi-Fi e infraestrutura',
            description = 'Atendimento demonstrativo para configuração de roteadores, extensão de cobertura, cabeamento e solução de problemas de conexão.',
            specialties = ARRAY['Redes', 'Wi-Fi', 'Infraestrutura'],
            service_categories = ARRAY['Redes e Wi-Fi'],
            service_area = 'Atendimento residencial e comercial',
            city = 'Cidade de demonstração',
            is_available = TRUE,
            is_demo = TRUE
        WHERE id = redes_id;
    END IF;

    IF hardware_id IS NOT NULL THEN
        UPDATE public.profiles
        SET
            role = 'professional',
            full_name = 'Conecta Demo - Hardware',
            presentation = 'Montagem e upgrade de computadores',
            description = 'Atendimento demonstrativo para montagem de PCs, upgrades de memória e armazenamento e testes de desempenho.',
            specialties = ARRAY['Hardware', 'Montagem', 'Upgrade'],
            service_categories = ARRAY['Hardware', 'Computadores'],
            service_area = 'Retirada e atendimento local',
            city = 'Cidade de demonstração',
            is_available = TRUE,
            is_demo = TRUE
        WHERE id = hardware_id;
    END IF;

    IF cliente_id IS NOT NULL THEN
        UPDATE public.profiles
        SET
            role = 'customer',
            full_name = 'Cliente Demonstrativo',
            city = 'Cidade de demonstração',
            is_demo = TRUE
        WHERE id = cliente_id;
    END IF;

    IF cliente_id IS NOT NULL AND pc_id IS NOT NULL THEN
        SELECT id INTO request_id
        FROM public.quote_requests
        WHERE customer_id = cliente_id
          AND professional_id = pc_id
          AND description LIKE 'DEMO:%'
        LIMIT 1;

        IF request_id IS NULL THEN
            INSERT INTO public.quote_requests (
                customer_id,
                professional_id,
                category,
                description,
                status
            )
            VALUES (
                cliente_id,
                pc_id,
                'Computadores',
                'DEMO: Notebook lento e travando ao iniciar programas.',
                'waiting'
            )
            RETURNING id INTO request_id;
        END IF;
    END IF;

    IF cliente_id IS NOT NULL AND redes_id IS NOT NULL THEN
        SELECT id INTO request_id
        FROM public.quote_requests
        WHERE customer_id = cliente_id
          AND professional_id = redes_id
          AND description LIKE 'DEMO:%'
        LIMIT 1;

        IF request_id IS NULL THEN
            INSERT INTO public.quote_requests (
                customer_id,
                professional_id,
                category,
                description,
                status
            )
            VALUES (
                cliente_id,
                redes_id,
                'Redes e Wi-Fi',
                'DEMO: O Wi-Fi perde sinal em dois cômodos da casa.',
                'proposal_sent'
            )
            RETURNING id INTO request_id;

            INSERT INTO public.quote_proposals (
                request_id,
                professional_id,
                customer_id,
                amount,
                message
            )
            VALUES (
                request_id,
                redes_id,
                cliente_id,
                180.00,
                'DEMO: Posso realizar uma vistoria, ajustar o roteador e configurar pontos de acesso.'
            );
        END IF;
    END IF;
END;
$$;
