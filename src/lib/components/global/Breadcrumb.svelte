<script>
    let { title, items } = $props();
</script>

<div class='d-flex justify-content-between'>
    <p class='h4 text-muted'><strong>{title}</strong></p>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            {#each items as item, i}
                <li class='breadcrumb-item { i === items.length ? 'active' : ''} text-muted'>{item}</li> 
            {/each}
        </ol>
    </nav>
</div>
